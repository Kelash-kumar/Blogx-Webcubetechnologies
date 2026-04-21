import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import path from "path";
import { ENV } from "./config/env.js";
import { errorMiddleware } from "./common/middlewares/error.middleware.js";
import healthRoutes from "./routes/health.routes.js";
import routes from "./routes/index.js";

const app = express();

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
    origin: ENV.CORS_ORIGIN,
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes
app.use("/health", healthRoutes);
app.use("/api/v1", routes);

app.get("/", (req, res) => {
    res.send("API Running...");
});

// global error handler
app.use(errorMiddleware);

export default app;