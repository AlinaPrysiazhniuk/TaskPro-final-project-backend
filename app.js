import express from "express";
import morgan from "morgan";
import cors from "cors";
import cardsRouter from "./routes/cardsRouter.js";
import path from "node:path";
import { createWriteStream } from "node:fs";
import authRouter from "./routes/auth.js";
import boardsRouter from "./routes/boardsRouter.js";
import columnsRouter from "./routes/columnsRouter.js";

const app = express();

const logPath = path.resolve("public", "server.log");
const accessLogStream = createWriteStream(logPath, { flags: "a" });

app.use(morgan("tiny", { stream: accessLogStream }));

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/api/board", boardsRouter);
app.use("/api/column", columnsRouter);
app.use("/api/cards", cardsRouter);

app.use(express.static("public"));

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

export default app;
