export class ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    pagination?: PaginationMeta;
    errors?: string[];

    constructor(success: boolean, message: string, data?: T, pagination?: PaginationMeta, errors?: string[]) {
        this.success = success;
        this.message = message;
        if (data !== undefined) this.data = data;
        if (pagination !== undefined) this.pagination = pagination;
        if (errors !== undefined) this.errors = errors;
    }

    static ok<T>(data: T, message = 'Success'): ApiResponse<T> {
        return new ApiResponse(true, message, data);
    }

    static paginated<T>(data: T[], meta: PaginationMeta, message = 'Success') {
        return new ApiResponse(true, message, data, meta);
    }

    static fail(message: string, errors?: string[]): ApiResponse<null> {
        return new ApiResponse(false, message, null as any, undefined, errors);
    }
}

export interface PaginationMeta {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
    limit: number;
}