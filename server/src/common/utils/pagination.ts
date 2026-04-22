import type { PaginationMeta } from "./apiResponse.js";

export const parsePagination = (query: any) => {
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(50, parseInt(query.limit) || 10);
    const skip = (page - 1) * limit;
    const sortBy = query.sortBy || "createdAt";
    const order = query.order === "asc" ? 1 : -1;
    return { page, limit, skip, sortBy, order };
};

export const buildMeta = (total: number, page: number, limit: number): PaginationMeta => ({
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalItems: total,
    hasNext: page < Math.ceil(total / limit),
    hasPrev: page > 1,
    limit,
});