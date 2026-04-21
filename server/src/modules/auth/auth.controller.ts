import type { Request, Response } from "express";
import { AuthService } from "./auth.service.js";
import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { ApiResponse } from "../../common/utils/apiResponse.js";

export const register = asyncHandler(async (req: Request, res: Response) => {
    const data = await AuthService.register(req.body);

    res.status(201).json(
        ApiResponse.ok(data, "User registered successfully")
    );
});

export const login = asyncHandler(async (req: Request, res: Response) => {
    const data = await AuthService.login(req.body);

    res.cookie("accessToken", data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000, // 15 mins
    });

    res.cookie("refreshToken", data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json(
        ApiResponse.ok({ user: data.user }, "Login successful")
    );
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
        return res.status(401).json(ApiResponse.fail("Refresh token required"));
    }

    const data = await AuthService.refreshToken(refreshToken);

    res.cookie("accessToken", data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
    });

    res.status(200).json(
        ApiResponse.ok(null, "Token refreshed")
    );
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
    await AuthService.logout(req.user.id);

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json(
        ApiResponse.ok(null, "Logout successful")
    );
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
    const data = await AuthService.getProfile(req.user.id);

    res.status(200).json(
        ApiResponse.ok(data, "User profile fetched successfully")
    );
});