export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    pagination?: PaginationMeta;
    errors?: string[];
}

export interface PaginationMeta {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
    limit: number;
}

export type PaginatedResponse<T> = ApiResponse<T[]>;
