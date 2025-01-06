import express, { Request } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import taskRoutes from "./routes/taskRoutes";
import { authMiddleware } from "./middleware/authMiddleware";
import cors from "cors";
import errorHandler from "./middleware/errorHandler";

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true, // Add this to allow credentials
};
console.log(corsOptions);

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
dotenv.config();

// console.log(process.env.PORT);
const PORT = process.env.PORT || 5000;

app.use(
  "/api",
  function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  },
  authRoutes
);
app.use("/api/task", authMiddleware, taskRoutes);

app.use(errorHandler);

app.listen(PORT, () => console.log("server running in port ", PORT));
