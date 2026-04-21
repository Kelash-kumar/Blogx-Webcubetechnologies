import api from "../api/axios";
import type { LoginCredentials, RegisterCredentials, AuthResponse, User } from "../types/auth.types";

export const authService = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>("/auth/login", credentials);
        return response.data;
    },

    register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>("/auth/register", credentials);
        return response.data;
    },

    logout: async (): Promise<void> => {
        await api.post("/auth/logout");
    },

    refresh: async (): Promise<void> => {
        await api.post("/auth/refresh");
    },

    getMe: async (): Promise<{ success: boolean; data: User }> => {
        const response = await api.get("/auth/me");
        return response.data;
    }
};
