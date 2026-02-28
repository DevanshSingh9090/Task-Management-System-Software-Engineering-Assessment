import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { config } from "./config";
import { authRouter } from "./modules/auth/auth.routes";
import { taskRouter } from "./modules/task/task.routes";
import { errorHandler } from "./middleware/errorHandler";

export const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use(
  cors({
    origin: config.FRONTEND_URL,
    credentials: true
  })
);

app.use("/auth", authRouter);
app.use("/tasks", taskRouter);

// health
app.get("/", (_req, res) => res.json({ success: true, data: "OK" }));

app.use(errorHandler);
