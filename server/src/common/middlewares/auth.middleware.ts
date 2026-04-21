import type { Request, Response, NextFunction } from "express";
import { ENV } from "../../config/env.js";
import { ApiError } from "../errors/ApiError.js";
import { ERROR_CODES } from "../errors/errorCodes.js";
import { verifyToken } from "../utils/jwt.js";
import jwt from "jsonwebtoken";

export const authenticate = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;
    let token = "";

    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1] as string;
    } else if (req.cookies && req.cookies.accessToken) {
        token = req.cookies.accessToken;
    }

    if (!token) {
        return next(new ApiError(ERROR_CODES.UNAUTHORIZED, "Access token required"));
    }

    try {
        const decoded = verifyToken(token, ENV.JWT_SECRET) as { id: string; role: "admin" | "author" };
        req.user = decoded;
        next();
    } catch (error) {
        const message = error instanceof jwt.TokenExpiredError
            ? "Token has expired"
            : "Invalid token";

        next(new ApiError(ERROR_CODES.UNAUTHORIZED, message));
    }
};