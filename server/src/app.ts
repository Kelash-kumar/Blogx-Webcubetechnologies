import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./common/middlewares/error.middleware.js";
import healthRoutes from "./routes/health.routes.js";
import routes from "./routes/index.js";

const app = express();

app.use(helmet());
app.use(cors({
    origin: ["http://localhost:5173"], // Default Vite port
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/health", healthRoutes);
app.use("/api/v1", routes);

app.get("/", (req, res) => {
    res.send("API Running...");
});

// global error handler
app.use(errorMiddleware);

export default app;