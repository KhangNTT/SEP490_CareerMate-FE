// Blog Status Enum
export enum BlogStatus {
    DRAFT = "DRAFT",
    PUBLISHED = "PUBLISHED",
    ARCHIVED = "ARCHIVED"
}

// Blog Request Interface
export interface BlogRequest {
    title: string;
    content: string;           // Rich HTML content from Quill
    summary?: string;
    thumbnailUrl?: string;
    category?: string;
    tags?: string[];
    status: BlogStatus;
}

// Blog Create Request Interface
export interface BlogCreateRequest {
    title: string;
    content: string;
    summary?: string;
    thumbnailUrl?: string;
    category?: string;
    tags?: string[];
    status: BlogStatus;
}

// Blog Update Request Interface
export interface BlogUpdateRequest {
    title?: string;
    content?: string;
    summary?: string;
    thumbnailUrl?: string;
    category?: string;
    tags?: string[];
    status?: BlogStatus;
}

// Blog Response Interface (matches your API)
export interface BlogResponse {
    id: number;
    title: string;
    content: string;
    summary?: string;
    thumbnailUrl?: string;
    category?: string;
    tags: string[];
    status: BlogStatus;
    viewCount: number;
    publishedAt?: string;
    createdAt: string;
    updatedAt: string;
    // Author information (from backend)
    authorId: number;
    authorName: string;
    // Aggregated stats (populated by backend)
    averageRating?: number;
    ratingCount?: number;
    commentCount?: number;
}

// API Response Wrapper (matches your backend format)
export interface ApiResponse<T> {
    code: number;
    message: string;
    result?: T;
}

// Paginated Response (matches your API structure)
export interface PagedResponse<T> {
    content: T[];
    pageable: {
        sort: {
            empty: boolean;
            sorted: boolean;
            unsorted: boolean;
        };
        offset: number;
        pageSize: number;
        pageNumber: number;
        paged: boolean;
        unpaged: boolean;
    };
    last: boolean;
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    first: boolean;
    numberOfElements: number;
    empty: boolean;
}

// Blog Pagination Parameters
export interface BlogPaginationParams {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: 'ASC' | 'DESC';
    sort?: string; // Simple sort string like "createdAt,desc"
    status?: string;
    category?: string;
    keyword?: string;
    search?: string; // Search in title, content, excerpt
    tag?: string; // Filter by tag
    authorId?: number; // Filter by author
}

// Error Codes
export enum ErrorCodes {
    SUCCESS = 1000,
    BLOG_NOT_FOUND = 1001,
    UNAUTHORIZED = 1002,
    FORBIDDEN = 1003,
    VALIDATION_ERROR = 1004,
    INTERNAL_ERROR = 1005
}

// Image Upload Response (Firebase Storage)
export interface ImageUploadResponse {
    imageUrl: string;
    publicId: string;
    fileSize: number;
    originalName: string;
    width: number;
    height: number;
}

// Comment System
export interface Comment {
    id: number;
    blogId: number;
    userId: number;
    userName: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    // Auto-flagging moderation fields (admin only)
    isFlagged?: boolean;
    flagReason?: string;
    flaggedAt?: string;
    reviewedByAdmin?: boolean;
}

export interface CommentCreateRequest {
    content: string;
}

export interface CommentUpdateRequest {
    content: string;
}

// Rating System
export interface Rating {
    id: number;
    blogId: number;
    userId: number;
    userName: string;
    rating: number; // 1-5
    createdAt: string;
}

export interface RatingCreateRequest {
    rating: number; // 1-5
}

export interface CommentPaginationParams {
    page?: number;
    size?: number;
}

// Legacy types for backward compatibility
export type Blog = BlogResponse;
export type PaginatedResponse<T> = PagedResponse<T>;
export type BlogStatusBadgeProps = {
    status: BlogStatus;
};
