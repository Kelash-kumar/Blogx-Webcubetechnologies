import type { User } from "./auth.types";
import type { ApiResponse, PaginatedResponse } from "./common.types";

export interface Comment {
    _id: string;
    content: string;
    post: string;
    author: User;
    parentComment?: string | null;
    createdAt: string;
    updatedAt: string;
}

export type CommentResponse = PaginatedResponse<Comment>;
export type SingleCommentResponse = ApiResponse<Comment>;
