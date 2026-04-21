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

    res.status(200).json(
        ApiResponse.ok(data, "Login successful")
    );
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    const data = await AuthService.refreshToken(refreshToken);

    res.status(200).json(
        ApiResponse.ok(data, "Token refreshed")
    );
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
    const data = await AuthService.logout(req.user.id);

    res.status(200).json(
        ApiResponse.ok(data, "Logout successful")
    );
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
    const data = await AuthService.getProfile(req.user.id);

    res.status(200).json(
        ApiResponse.ok(data, "User profile fetched successfully")
    );
});