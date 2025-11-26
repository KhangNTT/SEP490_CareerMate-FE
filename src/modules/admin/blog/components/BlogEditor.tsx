'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import dynamic from 'next/dynamic';
import ThumbnailUpload from './thumbnail-upload';
import { ArrowLeft, Save, Eye, Send } from 'lucide-react';
import Link from 'next/link';
import { fileUploadApi } from '@/lib/file-upload-api';
import { blogApi } from '@/lib/blog-api';
import { Blog, BlogCreateRequest, BlogUpdateRequest, BlogStatus } from '@/types/blog';
import { useAdminCheck } from '@/lib/auth-admin';
import toast from 'react-hot-toast';

// Lazy load TipTap editor to reduce initial bundle size
const TipTapEditor = dynamic(() => import('./tiptap-editor'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-64 border border-gray-200 rounded-lg bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Loading editor...</p>
            </div>
        </div>
    ),
});

interface BlogEditorProps {
    blogId?: number; // Optional for create, required for edit
    isEdit?: boolean;
}

export default function BlogEditor({ blogId, isEdit = false }: BlogEditorProps) {
    const router = useRouter();
    const { isAdmin, isChecking } = useAdminCheck();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEdit);
    const [previewMode, setPreviewMode] = useState(false);

    const [blog, setBlog] = useState<Blog | null>(null);
    const [formData, setFormData] = useState<BlogCreateRequest>({
        title: '',
        content: '',
        summary: '',
        thumbnailUrl: '',
        category: '',
        tags: [],
        status: BlogStatus.DRAFT
    });
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null); // Track thumbnail file for upload
    const [deletedThumbnailId, setDeletedThumbnailId] = useState<string | null>(null); // Track deleted thumbnail for cleanup

    useEffect(() => {
        if (isEdit && blogId) {
            fetchBlog();
        }
    }, [blogId, isEdit]);

    // Function to upload thumbnail image
    const uploadThumbnail = async (): Promise<string> => {
        if (!thumbnailFile) {
            throw new Error('No thumbnail file to upload');
        }

        const fileSizeMB = (thumbnailFile.size / (1024 * 1024)).toFixed(1);
        console.log(`📤 Starting upload: ${thumbnailFile.name} (${fileSizeMB}MB)`);

        try {
            toast.loading(`Uploading thumbnail (${fileSizeMB}MB)... This may take up to 60 seconds for large files.`, {
                duration: 5000,
            });

            const cloudinaryUrl = await fileUploadApi.uploadImage(thumbnailFile);
            setFormData(prev => ({ ...prev, thumbnailUrl: cloudinaryUrl }));

            toast.success(`Thumbnail uploaded successfully! (${fileSizeMB}MB)`);
            return cloudinaryUrl;
        } catch (error: any) {
            console.error('❌ Failed to upload thumbnail:', error);
            toast.error(`Upload failed: ${error.message}`);
            throw new Error(`Failed to upload thumbnail: ${error.message}`);
        }
    };

    const fetchBlog = async () => {
        if (!blogId) return;

        try {
            setInitialLoading(true);

            // Use real API only - authentication is now working
            const blogData = await blogApi.getBlog(blogId);

            setBlog(blogData);
            setFormData({
                title: blogData.title,
                content: blogData.content,
                summary: blogData.summary || '',
                thumbnailUrl: blogData.thumbnailUrl || '',
                category: blogData.category || '',
                tags: blogData.tags || [],
                status: blogData.status
            });
        } catch (error: any) {
            console.error('Error fetching blog:', error);
            if (error.response?.status === 404) {
                toast.error('Blog not found');
            } else {
                toast.error('Failed to load blog');
            }
            router.push('/admin/blog');
        } finally {
            setInitialLoading(false);
        }
    };

    const handleSubmit = async (status: BlogStatus) => {
        if (!formData.title.trim()) {
            toast.error('Title is required');
            return;
        }

        if (!formData.content.trim()) {
            toast.error('Content is required');
            return;
        }

        setLoading(true);

        const updatedFormData = { ...formData, status, content: formData.content };

        console.log('📝 Submitting blog with status:', status);

        try {
            // Upload thumbnail if needed
            if (thumbnailFile) {
                const cloudinaryUrl = await uploadThumbnail();
                // Update the form data with the new Cloudinary URL
                updatedFormData.thumbnailUrl = cloudinaryUrl;
            }

            // Clean up deleted thumbnail if needed
            if (deletedThumbnailId) {
                try {
                    await fileUploadApi.deleteImage(deletedThumbnailId);
                    setDeletedThumbnailId(null);
                } catch (error: any) {
                    console.warn('⚠️ Failed to clean up deleted thumbnail:', error.message);
                    // Don't throw - continue with blog save
                }
            }
            if (isEdit && blogId) {
                console.log('📝 Updating blog with status:', status);
                console.log('📝 Current blog status:', blog?.status);
                console.log('📝 Form data status:', updatedFormData.status);

                // Update the blog with new status
                const result = await blogApi.updateBlog(blogId, updatedFormData as BlogUpdateRequest);
                console.log('📝 Update result status:', result.status);

                // Use specific endpoints for status changes
                if (status === BlogStatus.PUBLISHED && blog?.status === BlogStatus.DRAFT) {
                    console.log('📝 Calling publish endpoint...');
                    try {
                        await blogApi.publishBlog(blogId);
                        updatedFormData.status = BlogStatus.PUBLISHED;
                        console.log('📝 Successfully published via endpoint');
                    } catch (publishError) {
                        console.warn('Failed to publish blog:', publishError);
                        // Fallback to updateBlog result
                        updatedFormData.status = result.status;
                    }
                } else if (status === BlogStatus.DRAFT && blog?.status === BlogStatus.PUBLISHED) {
                    console.log('📝 Calling unpublish endpoint...');
                    try {
                        await blogApi.unpublishBlog(blogId);
                        updatedFormData.status = BlogStatus.DRAFT;
                        console.log('📝 Successfully unpublished via endpoint');
                    } catch (unpublishError) {
                        console.warn('Failed to unpublish blog:', unpublishError);
                        // Fallback to updateBlog result
                        updatedFormData.status = result.status;
                    }
                } else {
                    // For other cases, trust the updateBlog result
                    console.log('📝 Using updateBlog result status:', result.status);
                    updatedFormData.status = result.status;
                }

                setFormData(updatedFormData); // Update local state
                setBlog(prev => prev ? { ...prev, ...updatedFormData } : null); // Update blog state
                const statusMessage = status === BlogStatus.PUBLISHED
                    ? 'published'
                    : 'saved as draft';
                toast.success(`Blog ${statusMessage} successfully!`);
            } else {
                await blogApi.createBlog(updatedFormData as BlogCreateRequest);
                toast.success(
                    status === BlogStatus.PUBLISHED
                        ? 'Blog published successfully!'
                        : 'Blog saved as draft!'
                );
            }

            // Redirect to blog list for new blogs, publishing, or saving as draft
            if (!isEdit || status === BlogStatus.PUBLISHED || status === BlogStatus.DRAFT) {
                setTimeout(() => {
                    router.push('/admin/blog');
                }, 1500);
            }
        } catch (error: any) {
            console.error('Error saving blog:', error);
            toast.error('Failed to save blog. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleContentChange = (content: string) => {
        setFormData(prev => ({ ...prev, content }));
    };

    if (initialLoading || isChecking) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">{isChecking ? 'Checking admin access...' : 'Loading blog editor...'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Link href="/admin/blog">
                <Button variant="outline" className="mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Blog Management
                </Button>
            </Link>

            <div className="max-w-4xl mx-auto">
                <Card className="w-full">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>{isEdit ? 'Edit Blog Post' : 'Create New Blog Post'}</CardTitle>
                            <div className="flex gap-2">
                                <Button
                                    variant={previewMode ? 'default' : 'outline'}
                                    onClick={() => setPreviewMode(!previewMode)}
                                    size="sm"
                                >
                                    <Eye className="w-4 h-4 mr-2" />
                                    {previewMode ? 'Edit' : 'Preview'}
                                </Button>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title">Title *</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Enter blog title..."
                                className="text-lg font-medium"
                            />
                        </div>

                        {/* Thumbnail Upload */}
                        <div className="space-y-2">
                            <Label htmlFor="thumbnail">Thumbnail Image</Label>
                            <ThumbnailUpload
                                value={formData.thumbnailUrl || ''}
                                onChange={(url) => setFormData(prev => ({ ...prev, thumbnailUrl: url }))}
                                onThumbnailChanged={() => { }} // No tracking needed
                                onFileChanged={setThumbnailFile} // Track file for later upload
                                onThumbnailDeleted={setDeletedThumbnailId} // Track deleted thumbnail for cleanup
                            />
                        </div>


                        {/* Status Display Only (Read-only) */}
                        <div className="space-y-2">
                            <Label>Current Status</Label>
                            <div className="flex items-center gap-2">
                                <Badge
                                    variant={formData.status === 'PUBLISHED' ? 'default' : formData.status === 'DRAFT' ? 'secondary' : 'outline'}
                                >
                                    {formData.status}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                    Use buttons below to change status
                                </span>
                            </div>
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Input
                                id="category"
                                value={formData.category || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                placeholder="e.g., Technology, Business, Lifestyle..."
                            />
                        </div>

                        {/* Tags */}
                        <div className="space-y-2">
                            <Label htmlFor="tags">Tags (comma-separated)</Label>
                            <Input
                                id="tags"
                                value={formData.tags?.join(', ') || ''}
                                onChange={(e) => {
                                    const tagsArray = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
                                    setFormData(prev => ({ ...prev, tags: tagsArray }));
                                }}
                                placeholder="e.g., react, javascript, tutorial"
                            />
                        </div>

                        {/* Summary */}
                        <div className="space-y-2">
                            <Label htmlFor="summary">Summary</Label>
                            <Textarea
                                id="summary"
                                value={formData.summary || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                                placeholder="A brief description of your blog post..."
                                rows={3}
                            />
                        </div>


                        {/* Content Editor */}
                        <div className="space-y-4">
                            <Label htmlFor="content">Content *</Label>

                            {/* Text Editor */}
                            {previewMode ? (
                                <div
                                    className="min-h-[400px] p-4 border rounded-md bg-white bg-opacity-50 prose max-w-none"
                                    dangerouslySetInnerHTML={{ __html: formData.content }}
                                />
                            ) : (
                                <TipTapEditor
                                    value={formData.content}
                                    onChange={handleContentChange}
                                    placeholder="Write your blog post content here..."
                                    className="min-h-[400px]"
                                />
                            )}
                        </div>

                        {/* Blog Stats (for edit mode) */}
                        {isEdit && blog && (
                            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-md">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900">
                                        {blog.averageRating || 0}
                                    </div>
                                    <div className="text-sm text-gray-600">Average Rating</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900">
                                        {blog.ratingCount || 0}
                                    </div>
                                    <div className="text-sm text-gray-600">Ratings</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900">
                                        {blog.commentCount || 0}
                                    </div>
                                    <div className="text-sm text-gray-600">Comments</div>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-6 border-t">
                            <Link href="/admin/blog">
                                <Button variant="outline">Cancel</Button>
                            </Link>

                            <Button
                                variant="outline"
                                onClick={() => handleSubmit(BlogStatus.DRAFT)}
                                disabled={loading}
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Save as Draft
                            </Button>

                            <Button
                                onClick={() => handleSubmit(BlogStatus.PUBLISHED)}
                                disabled={loading}
                            >
                                <Send className="w-4 h-4 mr-2" />
                                Publish
                            </Button>

                        </div>
                    </CardContent>
                </Card>
            </div>

            {
                loading && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 flex items-center gap-3">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                            <span>Saving blog post...</span>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
