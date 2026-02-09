/**
 * Shared API Types
 */

export interface ApiResponse<T = unknown> {
    success: boolean
    data?: T
    error?: string
    message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
    total: number
    page: number
    pageSize: number
}

export class AppError extends Error {
    constructor(
        public statusCode: number,
        message: string,
        public isOperational = true
    ) {
        super(message)
        Object.setPrototypeOf(this, AppError.prototype)
    }
}
