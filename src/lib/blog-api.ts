import api from './api';
import { fileUploadApi } from './file-upload-api';
import type {
    BlogResponse,
    BlogRequest,
    BlogCreateRequest,
    BlogUpdateRequest,
    ApiResponse,
    PagedResponse,
    BlogPaginationParams,
    Comment,
    CommentCreateRequest,
    CommentUpdateRequest,
    Rating,
    RatingCreateRequest,
    CommentPaginationParams,
    ImageUploadResponse,
    BlogStatus
} from '@/types/blog';

class BlogApiService {
    /**
     * Extract all Cloudinary publicIds from blog content and thumbnail
     */
    private async extractAndDeleteImages(blog: BlogResponse): Promise<void> {
        const imageIds: string[] = [];

        // Extract from thumbnail URL
        if (blog.thumbnailUrl && blog.thumbnailUrl.includes('cloudinary.com')) {
            const thumbnailMatch = blog.thumbnailUrl.match(/\/upload\/[^\/]+\/([^.]+\.\w+)$/);
            if (thumbnailMatch) {
                imageIds.push(thumbnailMatch[1]);
            }
        }

        // Extract from content (find all managed-image divs)
        if (blog.content) {
            const contentImageMatches = blog.content.match(/data-image-url="([^"]+)"/g);
            if (contentImageMatches) {
                contentImageMatches.forEach(match => {
                    const urlMatch = match.match(/data-image-url="([^"]+)"/);
                    if (urlMatch) {
                        const imageUrl = urlMatch[1];
                        if (imageUrl.includes('cloudinary.com')) {
                            const publicIdMatch = imageUrl.match(/\/upload\/[^\/]+\/([^.]+\.\w+)$/);
                            if (publicIdMatch) {
                                imageIds.push(publicIdMatch[1]);
                            }
                        }
                    }
                });
            }
        }

        // Delete all found images from Cloudinary
        if (imageIds.length > 0) {
            console.log(`🗑️ Found ${imageIds.length} images to delete from Cloudinary:`, imageIds);

            const deletePromises = imageIds.map(async (publicId) => {
                try {
                    await fileUploadApi.deleteImage(publicId);
                    console.log(`✅ Deleted Cloudinary image: ${publicId}`);
                } catch (error: any) {
                    console.warn(`⚠️ Failed to delete Cloudinary image ${publicId}:`, error.message);
                    // Don't throw - continue with other deletions
                }
            });

            await Promise.all(deletePromises);
            console.log('✅ All blog images deleted from Cloudinary');
        } else {
            console.log('📝 No images found in blog content');
        }
    }
    // Admin Blog Management

    async createBlog(data: BlogCreateRequest): Promise<BlogResponse> {
        console.log('📝 Creating blog with data:', data);
        const response = await api.post<ApiResponse<BlogResponse>>('/api/blogs', data);
        console.log('📝 Blog creation response:', response.data);
        console.log('📝 Response structure:', {
            hasCode: 'code' in response.data,
            hasResult: 'result' in response.data,
            hasMessage: 'message' in response.data,
            codeValue: response.data.code,
            responseKeys: Object.keys(response.data)
        });

        // Handle different response formats
        const responseData = response.data;

        // Check if it's an error response
        if (responseData.code !== undefined && responseData.code !== 0 && responseData.code !== 1000) {
            console.error('📝 Blog creation error:', responseData);
            throw new Error(responseData.message || 'Blog creation failed');
        }

        // Try to extract blog data from different possible formats
        if (responseData.result) {
            return responseData.result;
        }

        // If response is directly the blog object (success case)
        if ((responseData as any).id !== undefined) {
            return responseData as unknown as BlogResponse;
        }

        // If we get here, something is really wrong
        console.error('📝 Unexpected response format:', responseData);
        throw new Error('Unexpected response format from server');
    }

    async updateBlog(blogId: number, data: BlogUpdateRequest): Promise<BlogResponse> {
        console.log('📝 API updateBlog called with:', { blogId, data });
        console.log('📝 Data being sent includes status:', data.status);
        console.log('📝 Data being sent includes title:', data.title);
        console.log('📝 Complete request payload:', JSON.stringify(data, null, 2));

        const response = await api.put<ApiResponse<BlogResponse>>(`/api/blogs/${blogId}`, data);
        console.log('📝 API updateBlog response:', response.data);

        const responseData = response.data;

        if (responseData.code !== undefined && responseData.code !== 0 && responseData.code !== 1000) {
            console.error('📝 Blog update error:', responseData);
            throw new Error(responseData.message || 'Failed to update blog');
        }

        // Try different response formats
        if (responseData.result) {
            return responseData.result;
        }

        if ((responseData as any).id !== undefined) {
            return responseData as unknown as BlogResponse;
        }

        throw new Error('Unexpected response format from server');
    }

    async deleteBlog(blogId: number): Promise<void> {
        console.log('🗑️ Deleting blog with ID:', blogId);

        try {
            // First fetch the blog to extract image URLs before deletion
            console.log('🔍 Fetching blog data for image cleanup...');
            const blogData = await this.getBlog(blogId);

            // Clean up all images from Cloudinary before deleting blog
            await this.extractAndDeleteImages(blogData);

            // Now delete the blog from database
            console.log('🗑️ Deleting blog from database...');
            const response = await api.delete<ApiResponse<void>>(`/api/blogs/${blogId}`);
            console.log('🗑️ Blog deletion response:', response.data);

            // Handle different response formats - check for both 0 and 1000 as success codes
            const responseData = response.data;

            if (responseData.code !== undefined && responseData.code !== 0 && responseData.code !== 1000) {
                console.error('📝 Blog deletion error:', responseData);
                throw new Error(responseData.message || 'Failed to delete blog');
            }

            console.log('✅ Blog and all associated images deleted successfully');
        } catch (error: any) {
            console.error('❌ Error during blog deletion:', error);
            throw error;
        }
    }

    async publishBlog(blogId: number): Promise<BlogResponse> {
        const response = await api.put<ApiResponse<BlogResponse>>(`/api/blogs/${blogId}/publish`);

        const responseData = response.data;

        if (responseData.code !== undefined && responseData.code !== 0 && responseData.code !== 1000) {
            console.error('📝 Blog publish error:', responseData);
            throw new Error(responseData.message || 'Failed to publish blog');
        }

        // Try different response formats
        if (responseData.result) {
            return responseData.result;
        }

        if ((responseData as any).id !== undefined) {
            return responseData as unknown as BlogResponse;
        }

        throw new Error('Unexpected response format from server');
    }

    async unpublishBlog(blogId: number): Promise<BlogResponse> {
        const response = await api.put<ApiResponse<BlogResponse>>(`/api/blogs/${blogId}/unpublish`);
        const responseData = response.data;

        if (responseData.code !== undefined && responseData.code !== 0 && responseData.code !== 1000) {
            console.error('📝 Blog unpublish error:', responseData);
            throw new Error(responseData.message || 'Failed to unpublish blog');
        }

        // Try different response formats
        if (responseData.result) {
            return responseData.result;
        }

        if ((responseData as any).id !== undefined) {
            return responseData as unknown as BlogResponse;
        }

        throw new Error('Unexpected response format from server');
    }

    async archiveBlog(blogId: number): Promise<BlogResponse> {
        const response = await api.put<ApiResponse<BlogResponse>>(`/api/blogs/${blogId}/archive`);

        const responseData = response.data;

        if (responseData.code !== undefined && responseData.code !== 0 && responseData.code !== 1000) {
            console.error('📝 Blog archive error:', responseData);
            throw new Error(responseData.message || 'Failed to archive blog');
        }

        // Try different response formats
        if (responseData.result) {
            return responseData.result;
        }

        if ((responseData as any).id !== undefined) {
            return responseData as unknown as BlogResponse;
        }

        throw new Error('Unexpected response format from server');
    }

    async unarchiveBlog(blogId: number): Promise<BlogResponse> {
        const response = await api.put<ApiResponse<BlogResponse>>(`/api/blogs/${blogId}/unarchive`);
        const responseData = response.data;

        if (responseData.code !== undefined && responseData.code !== 0 && responseData.code !== 1000) {
            console.error('📝 Blog unarchive error:', responseData);
            throw new Error(responseData.message || 'Failed to unarchive blog');
        }

        // Try different response formats
        if (responseData.result) {
            return responseData.result;
        }

        if ((responseData as any).id !== undefined) {
            return responseData as unknown as BlogResponse;
        }

        throw new Error('Unexpected response format from server');
    }

    // Public Blog Endpoints (No Authentication Required)

    async getBlog(blogId: number): Promise<BlogResponse> {
        const response = await api.get<ApiResponse<BlogResponse>>(`/api/blogs/${blogId}`);

        const responseData = response.data;

        if (responseData.code !== undefined && responseData.code !== 0 && responseData.code !== 1000) {
            console.error('📝 Get blog error:', responseData);
            throw new Error(responseData.message || 'Failed to fetch blog');
        }

        // Try different response formats
        if (responseData.result) {
            return responseData.result;
        }

        if ((responseData as any).id !== undefined) {
            return responseData as unknown as BlogResponse;
        }

        throw new Error('Unexpected response format from server');
    }

    async getBlogs(params: BlogPaginationParams = {}): Promise<PagedResponse<BlogResponse>> {
        const {
            page = 0,
            size = 10,
            sortBy = 'createdAt',
            sortDir = 'DESC'
        } = params;

        // Build query parameters
        const queryParams = new URLSearchParams();
        queryParams.append('page', page.toString());
        queryParams.append('size', size.toString());
        queryParams.append('sortBy', sortBy);
        queryParams.append('sortDir', sortDir);

        const url = `/api/blogs?${queryParams.toString()}`;
        console.log('📋 Fetching all blogs with URL:', url);
        const response = await api.get<ApiResponse<PagedResponse<BlogResponse>>>(url);
        console.log('📋 Blogs response:', response.data);
        console.log('📋 Response structure:', {
            hasCode: 'code' in response.data,
            hasContent: 'content' in response.data,
            hasResult: 'result' in response.data,
            responseKeys: Object.keys(response.data)
        });

        const responseData = response.data;

        // Handle different response formats
        if ('content' in responseData && Array.isArray(responseData.content)) {
            // Direct pagination format (most common)
            return responseData as unknown as PagedResponse<BlogResponse>;
        }

        // Check for error response
        if (responseData.code !== undefined && responseData.code !== 0 && responseData.code !== 1000) {
            console.error('📋 Fetch blogs error:', responseData);
            throw new Error(responseData.message || 'Failed to fetch blogs');
        }

        // Try wrapped result format
        if (responseData.result) {
            return responseData.result;
        }

        // Last resort - return the raw response
        console.error('📋 Unexpected blogs response format:', responseData);
        throw new Error('Unexpected response format from server');
    }

    async getBlogsByStatus(status: string, params: BlogPaginationParams = {}): Promise<PagedResponse<BlogResponse>> {
        const {
            page = 0,
            size = 10,
            sortBy = 'createdAt',
            sortDir = 'DESC'
        } = params;

        const queryParams = new URLSearchParams();
        queryParams.append('page', page.toString());
        queryParams.append('size', size.toString());
        queryParams.append('sortBy', sortBy);
        queryParams.append('sortDir', sortDir);

        const url = `/api/blogs/status/${status}?${queryParams.toString()}`;
        console.log('📊 Fetching blogs by status with URL:', url);
        const response = await api.get<ApiResponse<PagedResponse<BlogResponse>>>(url);

        const responseData = response.data;

        if (responseData.code !== undefined && responseData.code !== 0 && responseData.code !== 1000) {
            console.error('📝 Get blogs by status error:', responseData);
            throw new Error(responseData.message || 'Failed to fetch blogs by status');
        }

        return responseData.result || responseData as unknown as PagedResponse<BlogResponse>;
    }

    async getBlogsByCategory(category: string, params: BlogPaginationParams = {}): Promise<PagedResponse<BlogResponse>> {
        const {
            page = 0,
            size = 10,
            sortBy = 'createdAt',
            sortDir = 'DESC'
        } = params;

        const queryParams = new URLSearchParams();
        queryParams.append('page', page.toString());
        queryParams.append('size', size.toString());
        queryParams.append('sortBy', sortBy);
        queryParams.append('sortDir', sortDir);

        const url = `/api/blogs/category/${category}?${queryParams.toString()}`;
        console.log('📁 Fetching blogs by category with URL:', url);
        const response = await api.get<ApiResponse<PagedResponse<BlogResponse>>>(url);

        const responseData = response.data;

        if (responseData.code !== undefined && responseData.code !== 0 && responseData.code !== 1000) {
            console.error('📝 Get blogs by category error:', responseData);
            throw new Error(responseData.message || 'Failed to fetch blogs by category');
        }

        return responseData.result || responseData as unknown as PagedResponse<BlogResponse>;
    }

    async searchBlogs(params: BlogPaginationParams = {}): Promise<PagedResponse<BlogResponse>> {
        const {
            keyword,
            status,
            page = 0,
            size = 10,
            sortBy = 'createdAt',
            sortDir = 'DESC'
        } = params;

        // Build query parameters for search endpoint
        const queryParams = new URLSearchParams();
        queryParams.append('page', page.toString());
        queryParams.append('size', size.toString());
        queryParams.append('sortBy', sortBy);
        queryParams.append('sortDir', sortDir);

        if (keyword) queryParams.append('keyword', keyword);
        if (status) queryParams.append('status', status);

        const url = `/api/blogs/search?${queryParams.toString()}`;
        console.log('🔍 Searching blogs with URL:', url);
        const response = await api.get<ApiResponse<PagedResponse<BlogResponse>>>(url);

        const responseData = response.data;

        if (responseData.code !== undefined && responseData.code !== 0 && responseData.code !== 1000) {
            console.error('📝 Search blogs error:', responseData);
            throw new Error(responseData.message || 'Failed to search blogs');
        }

        return responseData.result || responseData as unknown as PagedResponse<BlogResponse>;
    }

    async getCategories(): Promise<string[]> {
        const response = await api.get<ApiResponse<string[]>>('/api/blogs/categories');
        const responseData = response.data;
        
        if (responseData.code !== undefined && responseData.code !== 0 && responseData.code !== 1000) {
            console.error('📝 Get categories error:', responseData);
            throw new Error(responseData.message || 'Failed to fetch categories');
        }
        
        return responseData.result || [];
    }

    // Image Upload
    async uploadImage(file: File): Promise<string> {
        const formData = new FormData();
        // ⚠️ CRITICAL: Backend expects 'image' not 'file'
        formData.append('image', file);

        const response = await api.post<ApiResponse<ImageUploadResponse>>('/api/upload/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.data.code !== 1000) {
            throw new Error(response.data.message);
        }
        return response.data.result!.imageUrl;
    }

    // Comment endpoints - Updated to match new backend API
    async getComments(blogId: number, params: CommentPaginationParams = {}): Promise<PagedResponse<Comment>> {
        const { page = 0, size = 20 } = params;
        const response = await api.get(`/api/blogs/${blogId}/comments?page=${page}&size=${size}`);
        const responseData = response.data;

        // Handle wrapped response format
        if (responseData.code !== undefined && responseData.code !== 0 && responseData.code !== 1000) {
            throw new Error(responseData.message || 'Failed to fetch comments');
        }
        if (responseData.result) {
            return responseData.result;
        }
        if ((responseData as any).content !== undefined) {
            return responseData as unknown as PagedResponse<Comment>;
        }
        throw new Error('Unexpected response format from server');
    }

    async createComment(blogId: number, data: CommentCreateRequest): Promise<Comment> {
        const response = await api.post(`/api/blogs/${blogId}/comments`, data);
        const responseData = response.data;

        // Handle wrapped response format
        if (responseData.code !== undefined && responseData.code !== 0 && responseData.code !== 1000) {
            throw new Error(responseData.message || 'Failed to create comment');
        }
        if (responseData.result) {
            return responseData.result;
        }
        if ((responseData as any).id !== undefined) {
            return responseData as unknown as Comment;
        }
        throw new Error('Unexpected response format from server');
    }

    async updateComment(blogId: number, commentId: number, data: CommentUpdateRequest): Promise<Comment> {
        const response = await api.put(`/api/blogs/${blogId}/comments/${commentId}`, data);
        return response.data;
    }

    async deleteComment(blogId: number, commentId: number): Promise<void> {
        await api.delete(`/api/blogs/${blogId}/comments/${commentId}`);
    }

    // Rating endpoints - Updated to match new backend API
    async getRatings(blogId: number): Promise<Rating[]> {
        const response = await api.get(`/api/blogs/${blogId}/ratings`);
        const responseData = response.data;

        // Handle wrapped response format
        if (responseData.code !== undefined && responseData.code !== 0 && responseData.code !== 1000) {
            throw new Error(responseData.message || 'Failed to fetch ratings');
        }
        if (responseData.result) {
            return responseData.result;
        }
        if (Array.isArray(responseData)) {
            return responseData as unknown as Rating[];
        }
        throw new Error('Unexpected response format from server');
    }

    async createOrUpdateRating(blogId: number, data: RatingCreateRequest): Promise<Rating> {
        const response = await api.post(`/api/blogs/${blogId}/ratings`, data);
        const responseData = response.data;

        // Handle wrapped response format
        if (responseData.code !== undefined && responseData.code !== 0 && responseData.code !== 1000) {
            throw new Error(responseData.message || 'Failed to create/update rating');
        }
        if (responseData.result) {
            return responseData.result;
        }
        if ((responseData as any).id !== undefined) {
            return responseData as unknown as Rating;
        }
        throw new Error('Unexpected response format from server');
    }

    async getUserRating(blogId: number): Promise<Rating | null> {
        try {
            const response = await api.get(`/api/blogs/${blogId}/ratings/my-rating`);
            const responseData = response.data;

            // Handle wrapped response format
            if (responseData.code !== undefined && responseData.code !== 0 && responseData.code !== 1000) {
                throw new Error(responseData.message || 'Failed to fetch user rating');
            }
            if (responseData.result) {
                return responseData.result;
            }
            if ((responseData as any).id !== undefined) {
                return responseData as unknown as Rating;
            }
            return null;
        } catch (error: any) {
            // Return null if user hasn't rated (404) or other error
            if (error.response?.status === 404) {
                console.log(`User hasn't rated blog ${blogId} yet`);
                return null;
            }
            console.log('Error fetching user rating:', error.response?.status, error.response?.data);
            return null; // Don't throw - just return null for any error
        }
    }

    async deleteRating(blogId: number): Promise<void> {
        await api.delete(`/api/blogs/${blogId}/ratings`);
    }
}

export const blogApi = new BlogApiService();
export default blogApi;
