import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../utils/jwt";
import { config } from "../../config";
import { add } from "date-fns";

const prisma = new PrismaClient();
const SALT = 10;

export class AuthService {
  static async register(name: string, email: string, password: string) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw { status: 400, message: "Email already in use" };

    const hashed = await bcrypt.hash(password, SALT);

    const user = await prisma.user.create({
      data: { name, email, password: hashed }
    });

    return { id: user.id, name: user.name, email: user.email };
  }

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw { status: 401, message: "Invalid credentials" };

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw { status: 401, message: "Invalid credentials" };

    const accessToken = signAccessToken({
      userId: user.id,
      email: user.email,
      name: user.name
    });

    const refreshToken = signRefreshToken({
      userId: user.id,
      email: user.email,
      name: user.name
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    };
  }

  static async refresh(oldToken: string) {
    try {
      const payload = verifyRefreshToken(oldToken) as any;
      const tokens = await prisma.refreshToken.findMany({ where: { userId: payload.userId } });
      const match = await Promise.all(tokens.map(async t => ({ ok: await bcrypt.compare(oldToken, t.tokenHash), id: t.id }))).then(r => r.find(x => x.ok));
      if (!match) throw { status: 401, message: "Invalid refresh token" };
      // delete used token
      await prisma.refreshToken.delete({ where: { id: match.id } });
      const newRefresh = signRefreshToken({
        userId: payload.userId,
        email: payload.email,
        name: payload.name
      });

      const newAccess = signAccessToken({
        userId: payload.userId,
        email: payload.email,
        name: payload.name
      });
      const tokenHash = await bcrypt.hash(newRefresh, SALT);
      const expiresAt = add(new Date(), { days: 7 });
      await prisma.refreshToken.create({ data: { tokenHash, userId: payload.userId, expiresAt } });
      return { accessToken: newAccess, refreshToken: newRefresh, user: { id: payload.userId, email: payload.email } };
    } catch (err) {
      throw { status: 401, message: "Refresh failed" };
    }
  }

  static async logoutByUserId(userId: number) {
    await prisma.refreshToken.deleteMany({ where: { userId } });
    return true;
  }
}
