import api from "../api/axios";
import type { Post, PostResponse, PostStatsResponse } from "../types/post.types";

export interface PostFilters {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    tags?: string;
}

export const postService = {
    getPosts: async (filters: PostFilters = {}): Promise<PostResponse> => {
        const response = await api.get<PostResponse>("/posts", { params: filters });
        return response.data;
    },

    getMyPosts: async (filters: PostFilters = {}): Promise<PostResponse> => {
        const response = await api.get<PostResponse>("/posts/my", { params: filters });
        return response.data;
    },

    getPostById: async (id: string): Promise<Post> => {
        const response = await api.get(`/posts/${id}`);
        return response.data.data;
    },

    getStats: async (): Promise<PostStatsResponse["data"]> => {
        const response = await api.get<PostStatsResponse>("/posts/stats");
        return response.data.data;
    },

    createPost: async (formData: FormData): Promise<any> => {
        const response = await api.post("/posts", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    },

    updatePost: async (id: string, formData: FormData): Promise<any> => {
        const response = await api.put(`/posts/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    },

    deletePost: async (id: string): Promise<any> => {
        const response = await api.delete(`/posts/${id}`);
        return response.data;
    }
};
