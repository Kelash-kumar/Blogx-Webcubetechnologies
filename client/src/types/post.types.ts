import type { User } from "./auth.types";
import type { ApiResponse } from "./common.types";

export interface Post {
    _id: string;
    title: string;
    content: string;
    status: "draft" | "published";
    tags: string[];
    author: User;
    image?: string;
    createdAt: string;
    updatedAt: string;
}

export interface PostStats {
    totalPosts: number;
    publishedPosts: number;
    draftPosts: number;
}

export type PostResponse = ApiResponse<Post[]>;
export type SinglePostResponse = ApiResponse<Post>;
export type PostStatsResponse = ApiResponse<PostStats>;