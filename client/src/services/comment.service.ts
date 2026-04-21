import api from "../api/axios";
import type { CommentResponse, SingleCommentResponse } from "../types/comment.types";

export const commentService = {
    getCommentsByPost: async (postId: string, page = 1, limit = 10): Promise<CommentResponse> => {
        const response = await api.get<CommentResponse>(`/comments/post/${postId}`, {
            params: { page, limit }
        });
        return response.data;
    },

    addComment: async (postId: string, content: string): Promise<SingleCommentResponse> => {
        const response = await api.post<SingleCommentResponse>("/comments", {
            postId,
            content
        });
        return response.data;
    },

    deleteComment: async (commentId: string): Promise<void> => {
        await api.delete(`/comments/${commentId}`);
    }
};
