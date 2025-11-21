import api from './api';

export interface FileUploadResponse {
    code: number;
    message: string;
    result: {
        imageUrl: string; // Primary URL field from backend
        publicId: string; // Firebase storage path
        fileSize: number;
        originalName: string;
        width: number;
        height: number;
    };
}

export interface ImageDeleteResponse {
    code: number;
    message: string;
    result?: any;
}

export interface ImageExistsResponse {
    code: number;
    message: string;
    result: {
        exists: boolean;
        fileSize?: number;
        lastModified?: string;
    };
}

class FileUploadApiService {
    /**
     * Validates an image file before upload.
     * @param file - The image file to validate.
     * @returns An error message string if validation fails, otherwise null.
     */
    validateImageFile(file: File): string | null {
        if (!file.type.startsWith('image/')) {
            return 'Please select a valid image file (e.g., JPG, PNG, GIF, WebP).';
        }

        // Check file size with helpful error message
        const maxSize = 5 * 1024 * 1024; // 5MB limit
        if (file.size > maxSize) {
            const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
            const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(0);
            return `Image file is too large (${fileSizeMB}MB). Maximum allowed size is ${maxSizeMB}MB. Please compress or choose a smaller image.`;
        }

        // Check minimum file size
        if (file.size < 1024) { // Less than 1KB
            return 'Image file appears to be corrupted or too small (less than 1KB). Please choose a valid image file.';
        }

        return null;
    }

    /**
     * Upload an image file to the backend with folder support
     * @param file - The image file to upload
     * @param folder - Optional folder path (e.g., 'drafts/draft123' or 'blogs/456')
     * @returns Promise with image URL and metadata
     */
    async uploadImage(file: File, folder?: string): Promise<string> {
        // Validate file first (before making any API calls)
        const validationError = this.validateImageFile(file);
        if (validationError) {
            throw new Error(validationError);
        }

        // Use main API instance for upload which handles authentication and token refresh automatically
        console.log('📤 Starting image upload with automatic authentication...');
        
        const formData = new FormData();
        // ⚠️ CRITICAL: Backend expects field name to be 'image' not 'file'
        formData.append('image', file);
        
        // Note: Backend doesn't use 'folder' parameter - images go to default Firebase location

        console.log('📤 Uploading image to Firebase:');
        console.log('   - File name:', file.name);
        console.log('   - File size:', file.size, 'bytes');
        console.log('   - File type:', file.type);
        console.log('   - Endpoint:', `${api.defaults.baseURL}/api/upload/image`);

        // Log FormData contents for debugging
        console.log('📤 FormData contents:');
        for (const [key, value] of formData.entries()) {
            console.log(`   - ${key}:`, value instanceof File ? `File(${value.name})` : value);
        }
        console.log('   ⚠️  Field name MUST be "image" for backend to accept it');

        try {
            const response = await api.post<FileUploadResponse>('/api/upload/image', formData, {
                headers: {
                    // IMPORTANT: Delete the default Content-Type and let browser set it with boundary
                    'Content-Type': undefined as any, // This tells axios to let the browser set multipart/form-data with boundary
                },
                timeout: 60000, // 60 seconds timeout for file uploads
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        console.log(`📤 Upload progress: ${percentCompleted}%`);
                    }
                },
            });

            console.log('📤 Upload response:', response.status, response.data);

            if (response.data.code !== 1000 && response.data.code !== 0) {
                throw new Error(response.data.message);
            }

            // Use the backend response format
            const imageUrl = response.data.result.imageUrl;
            const publicId = response.data.result.publicId;
            console.log('✅ Image uploaded to Firebase successfully:', imageUrl);
            console.log('📁 Firebase storage path:', publicId);
            console.log('📏 Image dimensions:', `${response.data.result.width}x${response.data.result.height}`);
            console.log('💾 File size:', response.data.result.fileSize, 'bytes');

            // Return Firebase URL directly (no processing needed)
            return imageUrl;
        } catch (error: any) {
            console.error('❌ Upload error:', error.response?.status, error.response?.data);
            console.error('❌ Full error object:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                headers: error.response?.headers,
                config: {
                    url: error.config?.url,
                    method: error.config?.method,
                    headers: error.config?.headers
                }
            });

            if (error.response?.status === 400) {
                // Handle backend validation errors
                const backendError = error.response?.data?.message || 'Server validation error';
                console.error('❌ 400 Bad Request details:', {
                    message: backendError,
                    code: error.response?.data?.code,
                    fullResponse: error.response?.data
                });
                
                if (backendError.includes('large') || backendError.includes('size')) {
                    throw new Error('File size exceeds server limits. Please choose a smaller image (max 5MB).');
                }
                
                // More specific error messages
                if (backendError.includes('Uncategorized')) {
                    throw new Error(`Upload failed: The backend couldn't process the file. Please ensure the file is a valid image (JPG, PNG, GIF, WebP) and try again.`);
                }
                
                throw new Error(`Upload failed: ${backendError}`);
            } else if (error.response?.status === 401) {
                throw new Error('Authentication expired. Please refresh the page and log in again as admin.');
            } else if (error.response?.status === 403) {
                // More specific error message for admin privileges
                const backendMessage = error.response?.data?.message;
                if (backendMessage?.includes('Admin') || backendMessage?.includes('privilege')) {
                    throw new Error('Admin privileges required. Your session may have expired - please refresh the page and try again.');
                } else {
                    throw new Error('Access denied. Admin privileges required for image upload.');
                }
            } else if (error.response?.status === 413) {
                throw new Error('File too large. Please choose a smaller image.');
            } else if (error.response?.status >= 500) {
                throw new Error('Server error. Please try again later.');
            } else if (error.code === 'ECONNABORTED') {
                const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
                throw new Error(`Upload timeout after 60 seconds. File (${fileSizeMB}MB) might be too large or connection is slow. Try compressing the image or using a smaller file.`);
            } else if (!error.response) {
                throw new Error('Network error. Please check your connection and try again.');
            }

            // Generic fallback
            throw new Error(error.response?.data?.message || 'Upload failed. Please try again.');
        }
    }

    /**
     * Get the full URL for an image file
     * @param imagePath - The image path from upload response (e.g., "/api/files/filename.jpg")
     * @returns Full URL to the image
     */
    getImageUrl(imagePath: string): string {
        // If it's already a full URL (Firebase, internet, base64), return as is
        if (imagePath.startsWith('http') || imagePath.startsWith('data:') || imagePath.startsWith('//')) {
            return imagePath;
        }

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        // For local server paths
        if (imagePath.startsWith('/api')) {
            return `${baseUrl}${imagePath}`;
        }

        // If it's just a filename, prepend the files path
        return `${baseUrl}/api/files/${imagePath}`;
    }

    /**
     * Validate and process an internet image URL
     * @param url - The URL to validate and potentially upload
     * @returns Promise with the processed image URL
     */
    async processImageUrl(url: string): Promise<string> {
        if (!this.isValidImageUrl(url)) {
            throw new Error('Invalid image URL. Please provide a valid image URL (jpg, png, gif, webp, svg, or Firebase)');
        }

        // For Firebase Storage URLs or other CDN URLs, return as-is
        if (url.includes('firebase') || url.includes('googleapis.com') || url.includes('amazonaws.com') || url.includes('images.unsplash.com')) {
            return url;
        }

        // For other URLs, you could optionally upload them to Firebase for consistency
        // For now, we'll just validate and return the URL
        return url;
    }

    /**
     * Check if an image file exists on the server
     * @param fileName - The filename to check
     * @returns Promise with existence status
     */
    async checkImageExists(fileName: string): Promise<boolean> {
        try {
            const response = await api.get<ImageExistsResponse>(`/files/${fileName}/exists`);

            if (response.data.code !== 1000 && response.data.code !== 0) {
                return false;
            }

            return response.data.result.exists;
        } catch (error) {
            console.error('❌ Error checking image existence:', error);
            return false;
        }
    }

    /**
     * Delete an image file from Firebase Storage using public ID
     * @param publicId - The Firebase storage path to delete
     * @returns Promise with deletion result
     */
    async deleteImage(publicId: string): Promise<boolean> {
        if (!isAdmin()) {
            throw new Error('Admin privileges required to delete images');
        }

        console.log('🔍 Deleting Firebase image:', publicId);
        console.log('🔍 Delete URL:', `${api.defaults.baseURL}/api/images/${encodeURIComponent(publicId)}`);

        try {
            // Try URL path method first (DELETE /api/images/{publicId})
            const response = await api.delete<ImageDeleteResponse>(`/api/images/${encodeURIComponent(publicId)}`);

            if (response.data.code !== 1000 && response.data.code !== 0) {
                throw new Error(response.data.message);
            }

            console.log('✅ Image deleted from Firebase successfully:', publicId);
            return true;
        } catch (error: any) {
            // Handle specific error cases
            console.error('❌ Delete error:', error.response?.status, error.response?.data);

            if (error.response?.status === 401) {
                throw new Error('Authentication expired. Please log in again as admin.');
            } else if (error.response?.status === 403) {
                throw new Error('Access denied. Admin privileges required for image deletion.');
            } else if (error.response?.status === 404) {
                // Try request body method as fallback (DELETE /api/images with body)
                console.log('🔄 Trying request body method for deletion...');
                try {
                    const bodyResponse = await api.delete<ImageDeleteResponse>('/api/images', {
                        data: { publicId: publicId }
                    });

                    if (bodyResponse.data.code !== 1000 && bodyResponse.data.code !== 0) {
                        throw new Error(bodyResponse.data.message);
                    }

                    console.log('✅ Image deleted from Firebase successfully (body method):', publicId);
                    return true;
                } catch (bodyError: any) {
                    console.warn('⚠️ Both deletion methods failed:', bodyError.response?.status, bodyError.response?.data);
                    throw new Error('Backend deletion endpoint not implemented. Image removed from editor but remains in Firebase.');
                }
            }
            throw error;
        }
    }

    /**
     * Check if a URL is a valid image URL
     * @param url - The URL to validate
     * @returns True if URL appears to be an image
     */
    isValidImageUrl(url: string): boolean {
        try {
            const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
            const urlObj = new URL(url);
            const pathname = urlObj.pathname.toLowerCase();

            return validExtensions.some(ext => pathname.endsWith(ext)) ||
                url.includes('firebase') ||
                url.includes('googleapis.com') ||
                url.includes('images.unsplash.com') ||
                url.startsWith('data:image/');
        } catch {
            return url.startsWith('data:image/'); // Allow base64 images
        }
    }

}

export const fileUploadApi = new FileUploadApiService();
