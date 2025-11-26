'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    ArrowLeft,
    Star,
    MessageSquare,
    Calendar,
    User,
    Send,
    Share2,
    Bookmark,
    Clock,
    Eye,
    ThumbsUp,
    ThumbsDown
} from 'lucide-react';
import Link from 'next/link';
import { blogApi } from '@/lib/blog-api';
import { publicBlogApi } from '@/lib/public-blog-api';
import { useAuthStore } from '@/store/use-auth-store';
import { decodeJWT } from '@/lib/auth-admin';
import { Blog, Comment, Rating, PagedResponse } from '@/types/blog';
import toast from 'react-hot-toast';

interface BlogPostPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
    const router = useRouter();
    const paramsData = React.use(params);
    const blogId = parseInt(paramsData.id);
    const { accessToken, isAuthenticated } = useAuthStore();

    // Extract user info from JWT token
    const user = React.useMemo(() => {
        if (!accessToken) return null;
        try {
            const decoded = decodeJWT(accessToken);
            return {
                id: decoded?.sub || decoded?.userId || decoded?.id,
                email: decoded?.email || decoded?.username,
                name: decoded?.name || decoded?.username || decoded?.email,
                username: decoded?.username || decoded?.email
            };
        } catch (error) {
            console.error('Error decoding user from token:', error);
            return null;
        }
    }, [accessToken]);

    const [blog, setBlog] = useState<Blog | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [userRating, setUserRating] = useState<Rating | null>(null);
    const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [submittingComment, setSubmittingComment] = useState(false);
    const [submittingRating, setSubmittingRating] = useState(false);

    useEffect(() => {
        fetchBlogData();
    }, [blogId]);

    // Refresh comments and ratings when authentication state changes
    useEffect(() => {
        if (blogId) {
            refreshComments();
            if (isAuthenticated) {
                refreshUserRating();
            }
        }
    }, [isAuthenticated, blogId]);

    const refreshComments = async () => {
        try {
            let commentsData: PagedResponse<Comment>;

            if (isAuthenticated) {
                commentsData = await blogApi.getComments(blogId, { page: 0, size: 50 });
            } else {
                commentsData = await publicBlogApi.getComments(blogId, { page: 0, size: 50 });
            }

            setComments(commentsData.content || []);
        } catch (error: any) {
            console.error('Failed to refresh comments:', error.response?.status, error.response?.data);
        }
    };

    const refreshUserRating = async () => {
        if (!isAuthenticated) return;

        try {
            const userRatingData = await blogApi.getUserRating(blogId);
            setUserRating(userRatingData);
            if (userRatingData) {
                setRating(userRatingData.rating);
            } else {
                setRating(0);
            }
        } catch (error: any) {
            console.error('Failed to refresh user rating:', error.response?.status, error.response?.data);
        }
    };

    const fetchBlogData = async () => {
        try {
            setLoading(true);

            // Get blog data (public)
            let blogData = await publicBlogApi.getBlog(blogId);

            // Check for blob URLs and log warning
            if (blogData.thumbnailUrl?.startsWith('blob:')) {
                console.warn('⚠️ BLOB URL DETECTED:', {
                    blogId: blogData.id,
                    title: blogData.title,
                    thumbnailUrl: blogData.thumbnailUrl,
                    message: 'This blog has a blob URL stored as thumbnail - needs database cleanup'
                });
            }

            // If no thumbnail URL from public API, try authenticated API as fallback
            if (!blogData.thumbnailUrl) {
                try {
                    const authBlogData = await blogApi.getBlog(blogId);
                    if (authBlogData.thumbnailUrl) {
                        blogData = { ...blogData, thumbnailUrl: authBlogData.thumbnailUrl };
                    }
                } catch (authError) {
                    // Silently fail - public API is primary
                }
            }

            // Get comments (for all users - public access)
            let commentsData: PagedResponse<Comment> = {
                content: [],
                totalElements: 0,
                totalPages: 0,
                size: 50,
                number: 0,
                first: true,
                last: true,
                numberOfElements: 0,
                empty: true,
                pageable: {
                    pageNumber: 0,
                    pageSize: 50,
                    sort: { sorted: false, unsorted: true, empty: true },
                    offset: 0,
                    paged: true,
                    unpaged: false
                },
                sort: { sorted: false, unsorted: true, empty: true }
            };

            try {
                // Try authenticated API first (for better data)
                if (isAuthenticated) {
                    commentsData = await blogApi.getComments(blogId, { page: 0, size: 50 });
                } else {
                    // Use public API for unauthorized users
                    commentsData = await publicBlogApi.getComments(blogId, { page: 0, size: 50 });
                }
            } catch (error: any) {
                console.error('Failed to fetch comments:', error.response?.status, error.response?.data);
                // Keep empty comments data - don't show error to user
            }

            setBlog(blogData);
            setComments(commentsData.content || []);
            // Note: User rating will be fetched by refreshUserRating() in useEffect

            // Fetch related blogs
            await fetchRelatedBlogs(blogData);
        } catch (error: any) {
            console.error('❌ Error fetching blog data:', error);
            toast.error('Failed to load blog post');
            router.push('/blog');
        } finally {
            setLoading(false);
        }
    };

    const fetchRelatedBlogs = async (currentBlog: Blog) => {
        try {
            const params: any = {
                page: 0,
                size: 4, // Fetch 4 blogs
                status: 'PUBLISHED'
            };

            if (currentBlog.category) {
                params.keyword = currentBlog.category;
            }

            const response = await publicBlogApi.getBlogs(params);
            const allBlogs = response.content || [];

            const related = allBlogs
                .filter(b => b.id !== currentBlog.id)
                .slice(0, 4); // Get up to 4 related blogs

            setRelatedBlogs(related);
        } catch (error) {
            console.error('Error fetching related blogs:', error);
            // Don't show error to user, just leave related blogs empty
        }
    };

    const handleCommentSubmit = async () => {
        if (!isAuthenticated) {
            toast.error('Please sign in to comment');
            return;
        }

        if (!user?.id) {
            toast.error('User session expired. Please sign in again.');
            return;
        }

        if (!newComment.trim()) {
            toast.error('Please enter a comment');
            return;
        }

        setSubmittingComment(true);
        try {
            const newCommentData = await blogApi.createComment(blogId, {
                content: newComment.trim()
            });

            // Clear the input
            setNewComment('');

            // Refresh comments from backend to ensure persistence
            const updatedCommentsData = await blogApi.getComments(blogId, { page: 0, size: 50 });
            setComments(updatedCommentsData.content || []);

            toast.success('Comment submitted successfully!');

            // Update blog comment count
            if (blog) {
                setBlog(prev => prev ? { ...prev, commentCount: (prev.commentCount || 0) + 1 } : null);
            }
        } catch (error: any) {
            console.error('Error submitting comment:', error);
            if (error.response?.status === 401) {
                toast.error('Please sign in to comment');
            } else {
                toast.error('Failed to submit comment');
            }
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleRatingSubmit = async (newRating: number) => {
        if (!isAuthenticated) {
            toast.error('Please sign in to rate');
            return;
        }

        // Validate rating value
        if (newRating < 1 || newRating > 5) {
            toast.error('Rating must be between 1 and 5 stars');
            return;
        }

        setSubmittingRating(true);
        try {
            console.log('Submitting rating:', { blogId, rating: newRating });
            const ratingData = await blogApi.createOrUpdateRating(blogId, {
                rating: newRating
            });

            setRating(newRating);
            setUserRating(ratingData);
            toast.success(`Rating submitted: ${newRating} stars!`);

            // Update blog rating stats
            if (blog) {
                // Re-fetch blog data to get updated rating stats
                const updatedBlog = await publicBlogApi.getBlog(blogId);
                setBlog(updatedBlog);
            }
        } catch (error: any) {
            console.error('Error submitting rating:', error);
            console.error('Error response:', error.response?.data);
            
            const errorMessage = error.response?.data?.message || error.message || 'Failed to submit rating';
            if (error.response?.status === 401) {
                toast.error('Please sign in to rate this blog');
            } else if (error.response?.status === 400) {
                toast.error(`Invalid rating: ${errorMessage}`);
            } else {
                toast.error(errorMessage);
            }
        } finally {
            setSubmittingRating(false);
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'Invalid Date';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'Invalid Date';
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            return 'Invalid Date';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading blog post...</p>
                </div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
                    <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist.</p>
                    <Button onClick={() => router.push('/blog')}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Blog
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-5">
                        {/* Back Button */}
                        <div className="mb-6">
                            <Button
                                variant="outline"
                                onClick={() => router.push('/blog')}
                                className="flex items-center"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Blog
                            </Button>
                        </div>

                        {/* Blog Header */}
                        <div className="mb-8">
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {formatDate(blog.createdAt)}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    5 min read
                                </div>
                                <div className="flex items-center gap-1">
                                    <Eye className="w-4 h-4" />
                                    {blog.viewCount || 0} views
                                </div>
                            </div>

                            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                                {blog.title}
                            </h1>

                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                                        <User className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{blog.authorName || 'Unknown Author'}</p>
                                        <p className="text-sm text-gray-500">Content Creator</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm">
                                        <Share2 className="w-4 h-4 mr-2" />
                                        Share
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Bookmark className="w-4 h-4 mr-2" />
                                        Save
                                    </Button>
                                </div>
                            </div>

                            {/* Thumbnail */}
                            {blog.thumbnailUrl && !blog.thumbnailUrl.startsWith('blob:') ? (
                                <div className="mb-8">
                                    <img
                                        src={blog.thumbnailUrl}
                                        alt={blog.title}
                                        className="w-full h-64 object-cover rounded-lg shadow-lg"
                                        onError={(e) => {
                                            console.error('❌ Image failed to load:', blog.thumbnailUrl);
                                            console.error('❌ Image error:', e);
                                        }}
                                        onLoad={() => {
                                            console.log('✅ Image loaded successfully:', blog.thumbnailUrl);
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className="mb-8 p-8 bg-gray-100 rounded-lg text-center">
                                    <p className="text-gray-500">No thumbnail available</p>
                                </div>
                            )}

                            {/* Blog Content */}
                            <div className="prose prose-lg max-w-none">
                                <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                            </div>

                            {/* Rating Section */}
                            <div className="mt-12 p-6 bg-white rounded-lg border">
                                <h3 className="text-lg font-semibold mb-4">Rate this article</h3>
                                <div className="flex items-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => handleRatingSubmit(star)}
                                            disabled={submittingRating || !isAuthenticated}
                                            className={`p-1 transition-colors ${star <= (hoveredRating || rating)
                                                ? 'text-yellow-400'
                                                : 'text-gray-300'
                                                } ${submittingRating || !isAuthenticated ? 'opacity-50 cursor-not-allowed' : 'hover:text-yellow-400'}`}
                                            onMouseEnter={() => setHoveredRating(star)}
                                            onMouseLeave={() => setHoveredRating(0)}
                                        >
                                            <Star className="w-6 h-6 fill-current" />
                                        </button>
                                    ))}
                                    <span className="ml-2 text-sm text-gray-600">
                                        {rating > 0 ? `${rating} star${rating > 1 ? 's' : ''}` : 'Not rated'}
                                    </span>
                                </div>
                                {!isAuthenticated && (
                                    <p className="text-sm text-gray-500 mt-2">
                                        <Link href="/sign-in" className="text-blue-600 hover:underline">
                                            Sign in
                                        </Link> to rate this article
                                    </p>
                                )}
                            </div>

                            {/* Comments Section */}
                            <div className="mt-12">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <MessageSquare className="w-5 h-5" />
                                            Comments ({comments?.length || 0})
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {isAuthenticated ? (
                                            <div className="space-y-4">
                                                <Textarea
                                                    placeholder="Write a comment..."
                                                    value={newComment}
                                                    onChange={(e) => setNewComment(e.target.value)}
                                                    rows={3}
                                                />
                                                <div className="flex justify-end">
                                                    <Button
                                                        onClick={handleCommentSubmit}
                                                        disabled={submittingComment || !newComment.trim() || !isAuthenticated || !user?.id}
                                                    >
                                                        {submittingComment ? 'Submitting...' : 'Submit Comment'}
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-4">
                                                <p className="text-gray-600 mb-2">Sign in to leave a comment</p>
                                                <div className="flex gap-2 justify-center">
                                                    <Link href="/sign-in">
                                                        <Button variant="outline" size="sm">Sign In</Button>
                                                    </Link>
                                                    <Link href="/sign-up">
                                                        <Button size="sm">Sign Up</Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        )}

                                        {(comments?.length || 0) === 0 ? (
                                            <p className="text-gray-500 text-center py-4">
                                                {isAuthenticated
                                                    ? "No comments yet. Be the first to comment!"
                                                    : "Sign in to view and leave comments"
                                                }
                                            </p>
                                        ) : (
                                            <div className="mt-6 space-y-4">
                                                {(comments || []).map((comment, index) => (
                                                    <div key={`comment-${comment.id || comment.userId || index}`} className="border-l-4 border-gray-200 pl-4 py-2">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="font-medium text-gray-900">{comment.userName || 'Unknown User'}</span>
                                                            <span className="text-sm text-gray-500">
                                                                {formatDate(comment.createdAt)}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-700">{comment.content}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* About the Author */}
                        <Card>
                            <CardHeader>
                                <CardTitle>About the Author</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="flex items-start space-x-4 mb-4">
                                    <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <User className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{blog.authorName || 'Unknown Author'}</h3>
                                        <p className="text-sm text-gray-600 mb-3">Content Creator</p>
                                        <p className="text-sm text-gray-500 leading-relaxed">
                                            {blog.category === 'Technology'
                                                ? 'Tech enthusiast sharing insights on modern development and innovation.'
                                                : blog.category === 'Career'
                                                    ? 'Career expert helping professionals navigate their growth journey.'
                                                    : 'Experienced writer sharing valuable insights and practical advice.'
                                            }
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Related Articles - Simple Clean Design */}
                        {relatedBlogs.length > 0 && (
                            <Card className="hidden lg:block">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold">Related Articles</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-0">
                                    {relatedBlogs.map((relatedBlog, index) => (
                                        <div key={relatedBlog.id}>
                                            <Link
                                                href={`/blog/${relatedBlog.id}`}
                                                className="block py-3 hover:bg-gray-50 transition-colors"
                                            >
                                                <h4 className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors leading-relaxed">
                                                    {relatedBlog.title}
                                                </h4>
                                            </Link>
                                            {index < relatedBlogs.length - 1 && (
                                                <div className="border-b border-gray-200"></div>
                                            )}
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}