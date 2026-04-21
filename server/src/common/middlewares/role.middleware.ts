import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../errors/ApiError.js";
import { ERROR_CODES } from "../errors/errorCodes.js";

export const authorize = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            throw new ApiError(ERROR_CODES.FORBIDDEN, "Access denied");
        }
        next();
    };
};