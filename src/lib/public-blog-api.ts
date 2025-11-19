// Import axios directly (not the configured instance) to avoid any global interceptors
import axios from 'axios';
import { Blog, Comment, Rating, PagedResponse, BlogResponse } from '@/types/blog';

// Create a separate axios instance for public blog endpoints (no auth headers)
const publicApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Ensure no auth headers are attached by explicitly clearing them
publicApi.interceptors.request.use((config) => {
    // Explicitly ensure no auth headers
    delete config.headers.Authorization;
    delete config.headers.authorization;
    return config;
});

// Add error interceptor for better error handling
publicApi.interceptors.response.use(
    (response) => {
        return response; // Success - just return
    },
    (error) => {
        // Only log unexpected errors, not 401s (which are expected for comments)
        if (error.response?.status !== 401 && error.response?.status !== 403) {
            console.error('❌ Unexpected public API error:', error.response?.status, error.config?.url);
        }
        return Promise.reject(error);
    }
);

class PublicBlogApiService {
    async getBlogs(params: {
        page?: number;
        size?: number;
        sortBy?: string;
        sortDir?: string;
    }): Promise<PagedResponse<BlogResponse>> {
        // Build query parameters
        const queryParams = new URLSearchParams();
        queryParams.append('page', (params.page || 0).toString());
        queryParams.append('size', (params.size || 20).toString());
        queryParams.append('sortBy', params.sortBy || 'createdAt');
        queryParams.append('sortDir', params.sortDir || 'DESC');

        const url = `/api/blogs?${queryParams.toString()}`;
        console.log('📋 Public API - Fetching all blogs with URL:', url);
        const response = await publicApi.get(url);

        // Handle the wrapped response format from backend
        if (response.data.result) {
            return response.data.result;
        }

        return response.data;
    }

    async searchBlogs(params: {
        keyword?: string;
        page?: number;
        size?: number;
        sortBy?: string;
        sortDir?: string;
    }): Promise<PagedResponse<BlogResponse>> {
        const queryParams = new URLSearchParams();
        queryParams.append('page', (params.page || 0).toString());
        queryParams.append('size', (params.size || 20).toString());
        queryParams.append('sortBy', params.sortBy || 'createdAt');
        queryParams.append('sortDir', params.sortDir || 'DESC');

        if (params.keyword) queryParams.append('keyword', params.keyword);

        const url = `/api/blogs/search?${queryParams.toString()}`;
        console.log('🔍 Public API - Searching blogs with URL:', url);
        const response = await publicApi.get(url);

        if (response.data.result) {
            return response.data.result;
        }

        return response.data;
    }

    async getBlogsByCategory(category: string, params: {
        page?: number;
        size?: number;
        sortBy?: string;
        sortDir?: string;
    }): Promise<PagedResponse<BlogResponse>> {
        const queryParams = new URLSearchParams();
        queryParams.append('page', (params.page || 0).toString());
        queryParams.append('size', (params.size || 20).toString());
        queryParams.append('sortBy', params.sortBy || 'createdAt');
        queryParams.append('sortDir', params.sortDir || 'DESC');

        const url = `/api/blogs/category/${category}?${queryParams.toString()}`;
        console.log('📁 Public API - Fetching blogs by category with URL:', url);
        const response = await publicApi.get(url);

        if (response.data.result) {
            return response.data.result;
        }

        return response.data;
    }

    async getBlog(blogId: number): Promise<BlogResponse> {
        const response = await publicApi.get(`/api/blogs/${blogId}`);

        // Handle the wrapped response format from backend
        if (response.data.result) {
            return response.data.result;
        }

        return response.data;
    }

    async getComments(blogId: number, params: {
        page?: number;
        size?: number;
    }): Promise<PagedResponse<Comment>> {
        try {
            const url = `/api/blogs/${blogId}/comments?page=${params.page || 0}&size=${params.size || 20}`;
            const response = await publicApi.get<PagedResponse<Comment>>(url);
            return response.data;
        } catch (error: any) {
            // Comments require authentication - return empty response for unauthorized users
            if (error.response?.status === 401) {
                return {
                    content: [],
                    pageable: {
                        sort: { sorted: false, unsorted: true, empty: true },
                        offset: 0,
                        pageNumber: 0,
                        pageSize: params.size || 20,
                        paged: true,
                        unpaged: false
                    },
                    totalElements: 0,
                    totalPages: 0,
                    last: true,
                    first: true,
                    numberOfElements: 0,
                    empty: true,
                    sort: { sorted: false, unsorted: true, empty: true },
                    size: params.size || 20,
                    number: 0
                };
            }
            throw error;
        }
    }

    async getRatings(blogId: number): Promise<Rating[]> {
        try {
            const response = await publicApi.get<Rating[]>(`/api/blogs/${blogId}/rate`);
            return response.data;
        } catch (error: any) {
            // Ratings require authentication - return empty array for unauthorized users
            if (error.response?.status === 401) {
                return [];
            }
            throw error;
        }
    }

    async getUserRating(blogId: number): Promise<Rating | null> {
        try {
            const response = await publicApi.get<Rating>(`/api/blogs/${blogId}/rate/my-rating`);
            return response.data;
        } catch (error: any) {
            // Return null if user hasn't rated (404) or unauthorized (401)
            if (error.response?.status === 404 || error.response?.status === 401) {
                return null;
            }
            throw error;
        }
    }
}

export const publicBlogApi = new PublicBlogApiService();
