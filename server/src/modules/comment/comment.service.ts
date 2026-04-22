import { CommentRepository } from "./comment.repository.js";
import { PostRepository } from "../post/post.repository.js";
import { ApiError } from "../../common/errors/ApiError.js";
import { ERROR_CODES } from "../../common/errors/errorCodes.js";
import { buildMeta } from "../../common/utils/pagination.js";

export const CommentService = {
    async addComment(postId: string, authorId: string, content: string, parentCommentId?: string) {
        const post = await PostRepository.findById(postId);
        if (!post) {
            throw new ApiError(ERROR_CODES.NOT_FOUND, "Post not found");
        }

        if (parentCommentId) {
            const parent = await CommentRepository.findById(parentCommentId);
            if (!parent) {
                throw new ApiError(ERROR_CODES.NOT_FOUND, "Parent comment not found");
            }
        }

        return CommentRepository.create({
            content,
            post: postId,
            author: authorId,
            parentComment: parentCommentId || null,
        });
    },

    async getPostComments(postId: string, pagination: any) {
        const { skip, limit, page } = pagination;

        const comments = await CommentRepository.findByPostId(postId, skip, limit);
        const total = await CommentRepository.countByPostId(postId);

        return {
            comments,
            meta: buildMeta(total, page, limit),
        };
    },

    async updateComment(commentId: string, userId: string, _role: string, content: string) {
        const comment = await CommentRepository.findById(commentId);
        if (!comment) {
            throw new ApiError(ERROR_CODES.NOT_FOUND, "Comment not found");
        }

        // Handle both populated and unpopulated author field
        const authorId = comment.author._id ? comment.author._id.toString() : comment.author.toString();

        if (authorId !== userId) {
            throw new ApiError(ERROR_CODES.FORBIDDEN, "You can only edit your own comments");
        }

        return CommentRepository.update(commentId, content);
    },

    async deleteComment(commentId: string, userId: string, _role: string) {
        const comment = await CommentRepository.findById(commentId);
        if (!comment) {
            throw new ApiError(ERROR_CODES.NOT_FOUND, "Comment not found");
        }

        // Handle both populated and unpopulated author field
        const authorId = comment.author._id ? comment.author._id.toString() : comment.author.toString();

        if (authorId !== userId) {
            throw new ApiError(ERROR_CODES.FORBIDDEN, "You can only delete your own comments");
        }

        return CommentRepository.delete(commentId);
    },
};
