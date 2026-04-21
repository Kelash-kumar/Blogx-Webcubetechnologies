import { connectDB } from "./config/db.js";
import { ENV } from "./config/env.js";
import app from "./app.js";
import { logger } from "./common/utils/logger.js";

const startServer = async () => {
    try {
        await connectDB();

        const server = app.listen(ENV.PORT, () => {
            logger.info(`Server running on port ${ENV.PORT}`);
        });

        // Handle unhandled rejections
        process.on("unhandledRejection", (err: any) => {
            logger.error(`Shutting down due to Unhandled Rejection: ${err.message}`);
            server.close(() => {
                process.exit(1);
            });
        });
    } catch (error) {
        logger.error(`Failed to start server: ${error}`);
        process.exit(1);
    }
};

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
    logger.error(`Shutting down due to Uncaught Exception: ${err.message}`);
    process.exit(1);
});

startServer();