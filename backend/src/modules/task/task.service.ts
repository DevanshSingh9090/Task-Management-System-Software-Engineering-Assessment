import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class TaskService {
  static async create(userId: number, data: { title: string; description?: string }) {
    return prisma.task.create({ data: { ...data, userId } });
  }

  static async getById(userId: number, id: number) {
    return prisma.task.findFirst({ where: { id, userId } });
  }

  static async update(userId: number, id: number, data: any) {
    const result = await prisma.task.updateMany({ where: { id, userId }, data });
    if (result.count === 0) return null;
    return prisma.task.findUnique({ where: { id } });
  }

  static async delete(userId: number, id: number) {
    await prisma.task.deleteMany({ where: { id, userId } });
    return true;
  }

  static async toggle(userId: number, id: number) {
    const t = await prisma.task.findFirst({ where: { id, userId } });
    if (!t) return null;
    const newStatus = t.status === "PENDING" ? "COMPLETED" : "PENDING";
    return prisma.task.update({ where: { id }, data: { status: newStatus } });
  }

  static async list(userId: number, options: { page?: number; limit?: number; status?: string; search?: string }) {
    const page = options.page && options.page > 0 ? options.page : 1;
    const limit = options.limit && options.limit > 0 ? options.limit : 10;
    const skip = (page - 1) * limit;
    const where: any = { userId };
    if (options.status) where.status = options.status;
    if (options.search) where.title = { contains: options.search, mode: "insensitive" };
    const [tasks, total] = await Promise.all([
      prisma.task.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
      prisma.task.count({ where })
    ]);
    return { tasks, meta: { page, limit, total, pages: Math.ceil(total / limit) } };
  }
}
