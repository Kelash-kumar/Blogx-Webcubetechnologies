import express from "express";
import mongoose from "mongoose";

const router = express.Router();

router.get("/", (req, res) => {
    const healthCheck = {
        uptime: process.uptime(),
        message: "OK",
        timestamp: Date.now(),
        dbStatus: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    };

    try {
        res.send(healthCheck);
    } catch (error: any) {
        healthCheck.message = error.message;
        res.status(503).send(healthCheck);
    }
});

export default router;
