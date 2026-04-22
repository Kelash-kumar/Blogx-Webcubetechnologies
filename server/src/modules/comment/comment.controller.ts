import type { Request, Response } from "express";
import { CommentService } from "./comment.service.js";
import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { ApiResponse } from "../../common/utils/apiResponse.js";
import { parsePagination } from "../../common/utils/pagination.js";

export const addComment = asyncHandler(async (req: Request, res: Response) => {
    const { content, parentCommentId } = req.body;
    const postId = (req.params.postId || req.body.postId) as string;
    const comment = await CommentService.addComment(postId, req.user.id, content, parentCommentId);
    res.status(201).json(ApiResponse.ok(comment, "Comment added successfully"));
});

export const getPostComments = asyncHandler(async (req: Request, res: Response) => {
    const pagination = parsePagination(req.query);
    const { comments, meta } = await CommentService.getPostComments(req.params.postId as string, pagination);
    res.status(200).json(ApiResponse.paginated(comments, meta, "Comments fetched successfully"));
});

export const updateComment = asyncHandler(async (req: Request, res: Response) => {
    const comment = await CommentService.updateComment(req.params.id as string, req.user.id, req.user.role, req.body.content);
    res.status(200).json(ApiResponse.ok(comment, "Comment updated successfully"));
});

export const deleteComment = asyncHandler(async (req: Request, res: Response) => {
    await CommentService.deleteComment(req.params.id as string, req.user.id, req.user.role);
    res.status(200).json(ApiResponse.ok(null, "Comment deleted successfully"));
});
