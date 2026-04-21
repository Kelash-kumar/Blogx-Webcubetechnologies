import bcrypt from "bcryptjs";
import { AuthRepository } from "./auth.repository.js";
import { ApiError } from "../../common/errors/ApiError.js";
import { ERROR_CODES } from "../../common/errors/errorCodes.js";
import { ENV } from "../../config/env.js";
import {
    generateAccessToken,
    generateRefreshToken,
    verifyToken,
} from "../../common/utils/jwt.js";

export const AuthService = {
    async register(data: any) {
        const { name, username, email, password } = data;

        const existingEmail = await AuthRepository.findByEmail(email);
        if (existingEmail) {
            throw new ApiError(ERROR_CODES.BAD_REQUEST, "Email already exists");
        }

        const existingUsername = await AuthRepository.findByUsername(username);
        if (existingUsername) {
            throw new ApiError(ERROR_CODES.BAD_REQUEST, "Username already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await AuthRepository.createUser({
            name,
            username,
            email,
            password: hashedPassword,
        });

        return {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
        };
    },

    async login(data: any) {
        const { email, password } = data;

        const user = await AuthRepository.findByEmail(email);
        if (!user) {
            throw new ApiError(ERROR_CODES.UNAUTHORIZED, "Invalid credentials");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new ApiError(ERROR_CODES.UNAUTHORIZED, "Invalid credentials");
        }

        const payload = {
            id: user._id,
            role: user.role,
        };

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        await AuthRepository.updateRefreshToken(user._id.toString(), refreshToken);

        return {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            accessToken,
            refreshToken,
        };


    },

    async refreshToken(token: string) {
        try {
            const decoded: any = verifyToken(
                token,
                ENV.JWT_REFRESH_SECRET
            );

            const user = await AuthRepository.findById(decoded.id);

            if (!user || user.refreshToken !== token) {
                throw new ApiError(ERROR_CODES.UNAUTHORIZED, "Invalid refresh token");
            }

            const payload = {
                id: decoded.id,
                role: decoded.role,
            };

            return {
                accessToken: generateAccessToken(payload),
            };
        } catch (error) {
            throw new ApiError(ERROR_CODES.UNAUTHORIZED, "Invalid refresh token");
        }
    },

    async logout(userId: string) {
        await AuthRepository.updateRefreshToken(userId, null);
    },

    async getProfile(userId: string) {
        const user = await AuthRepository.findById(userId);
        if (!user) {
            throw new ApiError(ERROR_CODES.NOT_FOUND, "User not found");
        }
        const userObj = user.toObject() as any;
        delete userObj.refreshToken;

        return userObj;
    }
};