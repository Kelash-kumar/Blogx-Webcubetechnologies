import { PostRepository } from "./post.repository.js";
import { ApiError } from "../../common/errors/ApiError.js";
import { ERROR_CODES } from "../../common/errors/errorCodes.js";
import { buildMeta } from "../../common/utils/pagination.js";

export const PostService = {
    async createPost(data: any, authorId: string) {
        return PostRepository.create({ ...data, author: authorId });
    },

    async getAllPosts(query: any, pagination: any) {
        const { search, status, tags } = query;
        const { skip, limit, page } = pagination;

        const filter: any = {};
        if (search) filter.title = { $regex: search, $options: "i" };
        
        // Default to published if no status provided (Public view)
        filter.status = status || "published";
        
        if (tags) filter.tags = { $in: tags.split(",") };

        const posts = await PostRepository.findAll(filter, skip, limit);
        const total = await PostRepository.count(filter);

        return {
            posts,
            meta: buildMeta(total, page, limit),
        };
    },

    async getMyPosts(userId: string, role: string, query: any, pagination: any) {
        const { search, status, tags } = query;
        const { skip, limit, page } = pagination;

        // If admin, show all posts. If author, only show theirs.
        const filter: any = role === "admin" ? {} : { author: userId };
        
        if (search) filter.title = { $regex: search, $options: "i" };
        if (status) filter.status = status;
        if (tags) filter.tags = { $in: tags.split(",") };

        const posts = await PostRepository.findAll(filter, skip, limit);
        const total = await PostRepository.count(filter);

        return {
            posts,
            meta: buildMeta(total, page, limit),
        };
    },

    async getPostById(id: string) {
        const post = await PostRepository.findById(id);
        if (!post) {
            throw new ApiError(ERROR_CODES.NOT_FOUND, "Post not found");
        }
        return post;
    },

    async updatePost(id: string, userId: string, role: string, data: any) {
        const post = await this.getPostById(id);

        // Admin can update anything, author can only update their own
        if (role !== "admin" && post.author._id.toString() !== userId) {
            throw new ApiError(ERROR_CODES.FORBIDDEN, "You can only update your own posts");
        }

        return PostRepository.update(id, data);
    },

    async updatePostStatus(id: string, userId: string, role: string, status: string) {
        const post = await this.getPostById(id);

        if (role !== "admin" && post.author._id.toString() !== userId) {
            throw new ApiError(ERROR_CODES.FORBIDDEN, "You can only update status of your own posts");
        }

        return PostRepository.update(id, { status });
    },

    async deletePost(id: string, userId: string, role: string) {
        const post = await this.getPostById(id);

        if (role !== "admin" && post.author._id.toString() !== userId) {
            throw new ApiError(ERROR_CODES.FORBIDDEN, "You can only delete your own posts");
        }

        return PostRepository.delete(id);
    },

    async getPostStats() {
        const stats = await PostRepository.getStats();
        return stats[0] || { totalPosts: 0, publishedPosts: 0, draftPosts: 0 };
    },
};
