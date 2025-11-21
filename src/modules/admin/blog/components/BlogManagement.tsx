'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Plus,
    Search,
    Edit3,
    Trash2,
    Calendar,
    User,
    Star,
    MessageSquare,
    Eye,
    Clock,
    Archive,
    RotateCcw
} from 'lucide-react';
import { blogApi } from '@/lib/blog-api';
import { Blog } from '@/types/blog';
import { useAdminCheck } from '@/lib/auth-admin';
import toast from 'react-hot-toast';

// Dynamic imports for better performance
import ConfirmDialog from './ConfirmDialog';
import BlogStatusBadge from './BlogStatusBadge';

export default function BlogManagement() {
    const { isAdmin, isChecking } = useAdminCheck();
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState('');
    const [activeSearch, setActiveSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [categoryFilter, setCategoryFilter] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('createdAt,desc');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);
    const [previewBlog, setPreviewBlog] = useState<Blog | null>(null);
    const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
    const [categories, setCategories] = useState<string[]>([]);

    const pageSize = 10;

    const fetchBlogs = useCallback(async () => {
        try {
            setLoading(true);

            const commonParams = {
                page: currentPage,
                size: pageSize,
                sortBy: sortBy.split(',')[0],
                sortDir: sortBy.split(',')[1]?.toUpperCase() || 'DESC'
            };

            // Use the new unified filter endpoint that supports all filters simultaneously
            const response = await blogApi.filterBlogs({
                keyword: activeSearch || undefined,
                status: statusFilter || undefined,
                category: categoryFilter || undefined,
                ...commonParams
            });

            console.log('📦 Response:', response);

            setBlogs(response.content);
            setTotalPages(response.totalPages);
            setTotalElements(response.totalElements);
        } catch (error: any) {
            console.error('❌ Error fetching blogs:', error);
            toast.error('Failed to fetch blogs');
            setBlogs([]);
        } finally {
            setLoading(false);
        }
    }, [currentPage, activeSearch, statusFilter, categoryFilter, sortBy]);

    // Fetch available categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const cats = await blogApi.getCategories();
                setCategories(cats);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };
        fetchCategories();
    }, []);

    // Fetch blogs when filters change
    useEffect(() => {
        fetchBlogs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, activeSearch, statusFilter, categoryFilter, sortBy]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setActiveSearch(searchInput);
        setCurrentPage(0);
    };

    const handleClearSearch = () => {
        setSearchInput('');
        setActiveSearch('');
        setCurrentPage(0);
    };

    const handleDeleteBlog = async (blog: Blog) => {
        try {
            await blogApi.deleteBlog(blog.id);
            toast.success('Blog deleted successfully');
            fetchBlogs(); // Refresh the list
        } catch (error: any) {
            console.error('Error deleting blog:', error);
            toast.error('Failed to delete blog');
        } finally {
            setDeleteDialogOpen(false);
            setBlogToDelete(null);
        }
    };

    const confirmDelete = (blog: Blog) => {
        setBlogToDelete(blog);
        setDeleteDialogOpen(true);
    };

    const handleArchive = async (blog: Blog) => {
        try {
            await blogApi.archiveBlog(blog.id);
            toast.success('Blog archived successfully!');
            fetchBlogs(); // Refresh the list
        } catch (error: any) {
            console.error('Error archiving blog:', error);
            toast.error('Failed to archive blog. Please try again.');
        }
    };

    const handleUnarchive = async (blog: Blog) => {
        try {
            await blogApi.unarchiveBlog(blog.id);
            toast.success('Blog unarchived successfully!');
            fetchBlogs(); // Refresh the list
        } catch (error: any) {
            console.error('Error unarchiving blog:', error);
            toast.error('Failed to unarchive blog. Please try again.');
        }
    };

    const handleViewBlog = (blog: Blog) => {
        setPreviewBlog(blog);
        setPreviewDialogOpen(true);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading || isChecking) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">{isChecking ? 'Checking admin access...' : 'Loading blog posts...'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-6 py-8">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">Blog Management</h1>
                            <p className="text-lg text-gray-600">
                                Manage your blog posts ({totalElements} total)
                            </p>
                        </div>
                        <Link href="/admin/blog/create">
                            <Button className="flex items-center gap-2 px-6 py-3 text-lg font-medium">
                                <Plus className="w-5 h-5" />
                                Create New Blog
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Search and Filters */}
                <Card className="mb-8 shadow-sm">
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            {/* Search Form */}
                            <form onSubmit={handleSearch} className="flex items-center gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <Input
                                        placeholder="Search blogs (press Enter to search)..."
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        className="pl-12 h-12 text-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>
                                <Button type="submit" className="h-12 px-6">
                                    Search
                                </Button>
                                {activeSearch && (
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        onClick={handleClearSearch}
                                        className="h-12 px-6"
                                    >
                                        Clear
                                    </Button>
                                )}
                            </form>

                            {/* Filters Row */}
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => {
                                            setStatusFilter(e.target.value);
                                            setCurrentPage(0);
                                        }}
                                        className="w-full h-10 px-4 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="">All Status</option>
                                        <option value="DRAFT">Draft</option>
                                        <option value="PUBLISHED">Published</option>
                                        <option value="ARCHIVED">Archived</option>
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
                                    <select
                                        value={categoryFilter}
                                        onChange={(e) => {
                                            setCategoryFilter(e.target.value);
                                            setCurrentPage(0);
                                        }}
                                        className="w-full h-10 px-4 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="">All Categories</option>
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat.charAt(0) + cat.slice(1).toLowerCase()}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">Sort By</label>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-full h-10 px-4 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="createdAt,desc">Newest First</option>
                                        <option value="createdAt,asc">Oldest First</option>
                                        <option value="title,asc">Title (A-Z)</option>
                                        <option value="title,desc">Title (Z-A)</option>
                                        <option value="viewCount,desc">Most Viewed</option>
                                        <option value="averageRating,desc">Highest Rated</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Blog List */}
                <div className="space-y-6">
                    {blogs.length === 0 ? (
                        <Card className="shadow-sm">
                            <CardContent className="p-12 text-center">
                                <div className="text-xl text-gray-500 mb-4">
                                    {activeSearch || statusFilter || categoryFilter
                                        ? 'No blogs match your search criteria' 
                                        : 'No blogs found'}
                                </div>
                                {!activeSearch && !statusFilter && !categoryFilter && (
                                    <Link href="/admin/blog/create">
                                        <Button className="mt-4 px-6 py-3 text-lg">Create Your First Blog</Button>
                                    </Link>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        blogs.map((blog) => (
                            <Card key={blog.id} className="hover:shadow-lg transition-shadow duration-200 bg-white border border-gray-200">
                                <CardContent className="p-8">
                                    <div className="flex justify-between items-start gap-6">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-4">
                                                <h3 className="text-2xl font-bold text-gray-900 line-clamp-1">{blog.title}</h3>
                                                <BlogStatusBadge status={blog.status} />
                                            </div>

                                            <div className="flex items-center gap-6 text-base text-gray-600 mb-4">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-5 h-5" />
                                                    <span className="font-medium">{blog.authorName || 'Unknown Author'}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-5 h-5" />
                                                    <span>{formatDate(blog.createdAt)}</span>
                                                </div>
                                            </div>

                                            {/* Stats */}
                                            <div className="flex items-center gap-8 text-base text-gray-600 mb-5">
                                                {blog.averageRating !== undefined && blog.averageRating !== null && blog.averageRating > 0 && (
                                                    <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-full">
                                                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                                        <span className="font-medium">
                                                            {blog.averageRating.toFixed(1)} ({blog.ratingCount || 0} ratings)
                                                        </span>
                                                    </div>
                                                )}
                                                {blog.commentCount !== undefined && blog.commentCount !== null && blog.commentCount >= 0 && (
                                                    <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
                                                        <MessageSquare className="w-5 h-5 text-blue-500" />
                                                        <span className="font-medium">{blog.commentCount} comments</span>
                                                    </div>
                                                )}
                                                {blog.viewCount !== undefined && blog.viewCount !== null && blog.viewCount >= 0 && (
                                                    <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
                                                        <Eye className="w-5 h-5 text-green-500" />
                                                        <span className="font-medium">{blog.viewCount} views</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content Preview */}
                                            <div className="text-gray-700 text-lg leading-relaxed">
                                                {blog.content.replace(/<[^>]*>/g, '').substring(0, 250)}...
                                            </div>

                                            {/* Category and Tags */}
                                            {(blog.category || (blog.tags && blog.tags.length > 0)) && (
                                                <div className="mt-4 flex gap-2 flex-wrap">
                                                    {blog.category && (
                                                        <Badge variant="secondary" className="px-3 py-1 text-sm">
                                                            📂 {blog.category}
                                                        </Badge>
                                                    )}
                                                    {blog.tags && blog.tags.slice(0, 3).map((tag, index) => (
                                                        <Badge key={index} variant="outline" className="px-3 py-1 text-sm">
                                                            #{tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col gap-3 flex-shrink-0">
                                            <Button
                                                variant="outline"
                                                size="lg"
                                                onClick={() => handleViewBlog(blog)}
                                                title="Preview Blog"
                                                className="w-full px-4 py-3 font-medium"
                                            >
                                                <Eye className="w-5 h-5 mr-2" />
                                                Preview
                                            </Button>
                                            <Link href={`/admin/blog/edit/${blog.id}`}>
                                                <Button variant="outline" size="lg" className="w-full px-4 py-3 font-medium">
                                                    <Edit3 className="w-5 h-5 mr-2" />
                                                    Edit
                                                </Button>
                                            </Link>

                                            {/* Archive/Unarchive buttons based on status */}
                                            {blog.status === 'PUBLISHED' && (
                                                <Button
                                                    variant="outline"
                                                    size="lg"
                                                    onClick={() => handleArchive(blog)}
                                                    className="w-full px-4 py-3 font-medium text-orange-600 hover:text-orange-700 hover:border-orange-300 hover:bg-orange-50"
                                                >
                                                    <Archive className="w-5 h-5 mr-2" />
                                                    Archive
                                                </Button>
                                            )}

                                            {blog.status === 'ARCHIVED' && (
                                                <Button
                                                    variant="outline"
                                                    size="lg"
                                                    onClick={() => handleUnarchive(blog)}
                                                    className="w-full px-4 py-3 font-medium text-blue-600 hover:text-blue-700 hover:border-blue-300 hover:bg-blue-50"
                                                >
                                                    <RotateCcw className="w-5 h-5 mr-2" />
                                                    Unarchive
                                                </Button>
                                            )}

                                            <Button
                                                variant="outline"
                                                size="lg"
                                                onClick={() => confirmDelete(blog)}
                                                className="w-full px-4 py-3 font-medium text-red-600 hover:text-red-700 hover:border-red-300 hover:bg-red-50"
                                            >
                                                <Trash2 className="w-5 h-5 mr-2" />
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-12 p-6 bg-white rounded-lg shadow-sm">
                        <Button
                            variant="outline"
                            disabled={currentPage === 0}
                            onClick={() => setCurrentPage(currentPage - 1)}
                            className="px-6 py-3 font-medium disabled:opacity-50"
                        >
                            Previous
                        </Button>

                        <span className="text-lg text-gray-700 px-6 font-medium">
                            Page {currentPage + 1} of {totalPages}
                        </span>

                        <Button
                            variant="outline"
                            disabled={currentPage >= totalPages - 1}
                            onClick={() => setCurrentPage(currentPage + 1)}
                            className="px-6 py-3 font-medium disabled:opacity-50"
                        >
                            Next
                        </Button>
                    </div>
                )}

                {/* Delete Confirmation Dialog */}
                {deleteDialogOpen && blogToDelete && (
                    <ConfirmDialog
                        open={deleteDialogOpen}
                        onClose={() => setDeleteDialogOpen(false)}
                        onConfirm={() => handleDeleteBlog(blogToDelete)}
                        title="Delete Blog"
                        description={`Are you sure you want to delete "${blogToDelete.title}"? This action cannot be undone and will also delete all associated comments and ratings.`.trim()}
                        confirmText="Delete"
                        cancelText="Cancel"
                        variant="destructive"
                    />
                )}

                {/* Blog Preview Dialog */}
                {previewDialogOpen && previewBlog && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
                        <div className="max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-2xl bg-white rounded-lg">
                            {/* Close Button */}
                            <div className="flex justify-end p-4 border-b bg-gray-50">
                                <Button
                                    variant="outline"
                                    onClick={() => setPreviewDialogOpen(false)}
                                    size="lg"
                                    className="px-4 py-2 font-medium border-2"
                                >
                                    ✕ Close Preview
                                </Button>
                            </div>
                            {/* User-facing Blog Layout */}
                            <div className="overflow-y-auto max-h-[calc(95vh-120px)] bg-gray-50">
                                <div className="bg-white shadow-lg min-h-[calc(95vh-120px)]">
                                    <div className="max-w-4xl mx-auto px-8 py-8">
                                        {/* Title */}
                                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                            {previewBlog.title}
                                        </h1>

                                        {/* Meta Information (User-facing style) */}
                                        <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4" />
                                                <span>{previewBlog.authorName || 'Unknown Author'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                <span>{new Date(previewBlog.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                <span>{Math.ceil(previewBlog.content.replace(/<[^>]*>/g, '').split(' ').length / 200)} min read</span>
                                            </div>
                                        </div>

                                        {/* Category and Tags (User-facing style) */}
                                        <div className="flex items-center gap-4 mb-6">
                                            {previewBlog.category && (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                    {previewBlog.category}
                                                </span>
                                            )}
                                            {previewBlog.tags && previewBlog.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {previewBlog.tags.map((tag, index) => (
                                                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Summary (User-facing style) */}
                                        {previewBlog.summary && (
                                            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                                <p className="text-gray-700 italic">"{previewBlog.summary}"</p>
                                            </div>
                                        )}

                                        {/* Thumbnail (User-facing style) */}
                                        {previewBlog.thumbnailUrl && (
                                            <div className="mb-6">
                                                <img
                                                    src={previewBlog.thumbnailUrl}
                                                    alt={previewBlog.title}
                                                    className="w-full h-64 object-cover rounded-lg"
                                                />
                                            </div>
                                        )}

                                        {/* Content (User-facing style) */}
                                        <div className="prose max-w-none">
                                            <div dangerouslySetInnerHTML={{ __html: previewBlog.content }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
