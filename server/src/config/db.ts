import mongoose from "mongoose";
import { ENV } from "./env.js";
import { logger } from "../common/utils/logger.js";

export const connectDB = async () => {
    try {
        await mongoose.connect(ENV.MONGO_URI);
        logger.info("MongoDB connected");
    } catch (error) {
        logger.error("DB error:", error);
        process.exit(1);
    }
};