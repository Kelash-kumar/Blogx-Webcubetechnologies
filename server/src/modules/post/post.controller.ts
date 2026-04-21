import type { Request, Response } from "express";
import { PostService } from "./post.service.js";
import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { ApiResponse } from "../../common/utils/apiResponse.js";
import { parsePagination } from "../../common/utils/pagination.js";

export const createPost = asyncHandler(async (req: Request, res: Response) => {
    if (req.file) {
        req.body.image = `${req.protocol}://${req.get("host")}/uploads/posts/${req.file.filename}`;
    }
    const post = await PostService.createPost(req.body, req.user.id);
    res.status(201).json(ApiResponse.ok(post, "Post created successfully"));
});

export const getPosts = asyncHandler(async (req: Request, res: Response) => {
    const pagination = parsePagination(req.query);
    const { posts, meta } = await PostService.getAllPosts(req.query, pagination);
    res.status(200).json(ApiResponse.paginated(posts, meta, "Posts fetched successfully"));
});

export const getPost = asyncHandler(async (req: Request, res: Response) => {
    const post = await PostService.getPostById(req.params.id as string);
    res.status(200).json(ApiResponse.ok(post, "Post fetched successfully"));
});

export const updatePost = asyncHandler(async (req: Request, res: Response) => {
    if (req.file) {
        req.body.image = `${req.protocol}://${req.get("host")}/uploads/posts/${req.file.filename}`;
    }
    const post = await PostService.updatePost(req.params.id as string, req.user.id, req.body);
    res.status(200).json(ApiResponse.ok(post, "Post updated successfully"));
});

export const deletePost = asyncHandler(async (req: Request, res: Response) => {
    await PostService.deletePost(req.params.id as string, req.user.id);
    res.status(200).json(ApiResponse.ok(null, "Post deleted successfully"));
});
