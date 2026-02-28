import { Router } from "express";
import { AuthService } from "./auth.service";
import { validateBody } from "../../middleware/validate";
import { loginSchema, registerSchema } from "./auth.schema";
import { parseExpiryToMs } from "../../utils/parseExpiry";
import { config } from "../../config";
import { verifyRefreshToken, verifyAccessToken } from "../../utils/jwt";

const router = Router();

const cookieOpts = (maxAge: number) => ({
  httpOnly: true,
  secure: config.COOKIE_SECURE,
  sameSite: "lax" as const,
  maxAge
});

// register
router.post("/register", validateBody(registerSchema), async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await AuthService.register(name, email, password);
    res.status(201).json({ success: true, data: user });
  } catch (err) { next(err); }
});

// login
router.post("/login", validateBody(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken, user } = await AuthService.login(email, password);
    const accessMs = parseExpiryToMs(config.ACCESS_TOKEN_EXPIRES_IN);
    const refreshMs = parseExpiryToMs(config.REFRESH_TOKEN_EXPIRES_IN);
    res.cookie("accessToken", accessToken, cookieOpts(accessMs));
    res.cookie("refreshToken", refreshToken, cookieOpts(refreshMs));
    res.json({ success: true, data: { user } });
  } catch (err) { next(err); }
});

// refresh
router.post("/refresh", async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken || req.body.refreshToken;
    if (!token) return res.status(401).json({ success: false, message: "No token" });
    const { accessToken, refreshToken } = await AuthService.refresh(token);
    const accessMs = parseExpiryToMs(config.ACCESS_TOKEN_EXPIRES_IN);
    const refreshMs = parseExpiryToMs(config.REFRESH_TOKEN_EXPIRES_IN);
    res.cookie("accessToken", accessToken, cookieOpts(accessMs));
    res.cookie("refreshToken", refreshToken, cookieOpts(refreshMs));
    res.json({ success: true });
  } catch (err) { next(err); }
});

// me
router.get("/me", async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const payload = verifyAccessToken(token) as {
      userId: number;
      email: string;
      name: string;
    };

    res.json({
          success: true,
          data: {
            user: {
              id: payload.userId,
              email: payload.email,
              name: payload.name   // ✅ ADD NAME HERE
            }
          }
        });
      } catch (err) {
        next(err);
      }
    });

// logout
router.post("/logout", async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      try {
        const payload = verifyRefreshToken(token) as any;
        await AuthService.logoutByUserId(payload.userId);
      } catch (_) {}
    } else {
      // try access token
      try {
        const payload = verifyAccessToken(req.cookies.accessToken) as any;
        await AuthService.logoutByUserId(payload.userId);
      } catch (_) {}
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ success: true });
  } catch (err) { next(err); }
});

export const authRouter = router;
