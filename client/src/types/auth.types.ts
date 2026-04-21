import type { ApiResponse } from "./common.types";

export type Role = "admin" | "author";

export interface User {
    _id?: string; // MongoDB style
    id: string;
    name: string;
    email: string;
    role: Role;
    username?: string;
    avatar?: string;
    bio?: string;
}

export interface AuthData {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
    role?: Role;
}

export type AuthResponse = ApiResponse<AuthData>;
export type ProfileResponse = ApiResponse<User>;