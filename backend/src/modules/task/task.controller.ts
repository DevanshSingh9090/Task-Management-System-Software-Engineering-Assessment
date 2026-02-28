import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware";
import { TaskService } from "./task.service";
import { validateBody } from "../../middleware/validate";
import { createTaskSchema, updateTaskSchema } from "./task.schema";

const router = Router();

router.use(authMiddleware);

router.post("/", validateBody(createTaskSchema), async (req: any, res, next) => {
  try {
    const userId = req.user.id;
    const task = await TaskService.create(userId, req.body);
    res.status(201).json({ success: true, data: task });
  } catch (err) { next(err); }
});

router.get("/", async (req: any, res, next) => {
  try {
    const userId = req.user.id;
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const status = req.query.status as string | undefined;
    const search = req.query.search as string | undefined;
    const result = await TaskService.list(userId, { page, limit, status, search });
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
});

router.get("/:id", async (req: any, res, next) => {
  try {
    const userId = req.user.id;
    const id = Number(req.params.id);
    const task = await TaskService.getById(userId, id);
    if (!task) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: task });
  } catch (err) { next(err); }
});

router.patch("/:id", validateBody(updateTaskSchema), async (req: any, res, next) => {
  try {
    const userId = req.user.id;
    const id = Number(req.params.id);
    const task = await TaskService.update(userId, id, req.body);
    if (!task) return res.status(404).json({ success: false, message: "Not found or not allowed" });
    res.json({ success: true, data: task });
  } catch (err) { next(err); }
});

router.delete("/:id", async (req: any, res, next) => {
  try {
    const userId = req.user.id;
    const id = Number(req.params.id);
    await TaskService.delete(userId, id);
    res.json({ success: true, data: "Deleted" });
  } catch (err) { next(err); }
});

router.patch("/:id/toggle", async (req: any, res, next) => {
  try {
    const userId = req.user.id;
    const id = Number(req.params.id);
    const task = await TaskService.toggle(userId, id);
    if (!task) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: task });
  } catch (err) { next(err); }
});

export const taskRouter = router;
