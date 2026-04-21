import jwt from "jsonwebtoken";
import { ENV } from "../../config/env.js";

export const generateAccessToken = (payload: any) => {
    return jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = (payload: any) => {
    return jwt.sign(payload, ENV.JWT_REFRESH_SECRET, {
        expiresIn: "7d",
    });
};

export const verifyToken = (token: string, secret: string) => {
    return jwt.verify(token, secret);
};