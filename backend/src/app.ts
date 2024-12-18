import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import taskRoutes from "./routes/taskRoutes";
import { authMiddleware } from "./middleware/authMiddleware";

const app = express();
app.use(express.json());
dotenv.config();

// console.log(process.env.PORT);
const PORT = process.env.PORT || 5000;

app.use("/api", authRoutes);
app.use("/api/task", authMiddleware, taskRoutes);

app.listen(PORT, () => console.log("server running in port ", PORT));
