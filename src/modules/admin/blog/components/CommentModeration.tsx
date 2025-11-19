'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Search,
    Trash2,
    Eye,
    EyeOff,
    Calendar,
    User,
    Mail,
    MessageSquare,
    TrendingUp,
    BarChart3,
    X
} from 'lucide-react';
import { adminModerationApi, type AdminCommentResponse, type AdminCommentFilters, type CommentStatistics } from '@/lib/admin-moderation-api';
import toast from 'react-hot-toast';

export default function CommentModeration() {
    const [comments, setComments] = useState<AdminCommentResponse[]>([]);
    const [statistics, setStatistics] = useState<CommentStatistics | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    
    // Filters
    const [searchEmail, setSearchEmail] = useState('');
    const [blogIdFilter, setBlogIdFilter] = useState('');
    const [sortBy, setSortBy] = useState<'createdAt' | 'updatedAt'>('createdAt');
    const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('DESC');

    const pageSize = 20;

    useEffect(() => {
        fetchComments();
        fetchStatistics();
    }, [currentPage, sortBy, sortDirection]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            
            const filters: AdminCommentFilters = {
                page: currentPage,
                size: pageSize,
                sortBy,
                sortDirection,
            };

            if (searchEmail) filters.userEmail = searchEmail;
            if (blogIdFilter) filters.blogId = parseInt(blogIdFilter);

            const response = await adminModerationApi.getAllComments(filters);
            
            console.log('📥 Fetched comments:', response.content);
            console.log('📊 Sample comment structure:', response.content[0]);
            
            setComments(response.content);
            setTotalPages(response.totalPages);
            setTotalElements(response.totalElements);
        } catch (error: any) {
            console.error('Error fetching comments:', error);
            // Don't show toast on initial load if backend endpoint not ready
            if (comments.length > 0) {
                toast.error(error.message || 'Failed to fetch comments');
            }
            setComments([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchStatistics = async () => {
        try {
            const stats = await adminModerationApi.getCommentStatistics();
            setStatistics(stats);
        } catch (error: any) {
            console.error('Error fetching statistics:', error);
            // Silently fail - statistics are optional
            setStatistics(null);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(0);
        fetchComments();
    };

    const handleDeleteComment = async (commentId: number) => {
        if (!confirm('Are you sure you want to permanently delete this comment?')) {
            return;
        }

        try {
            await adminModerationApi.deleteComment(commentId);
            toast.success('Comment deleted successfully');
            fetchComments();
            fetchStatistics();
        } catch (error: any) {
            console.error('Error deleting comment:', error);
            toast.error(error.message || 'Failed to delete comment');
        }
    };

    const handleHideComment = async (commentId: number) => {
        try {
            // Optimistically update UI
            setComments(prev => prev.map(c => 
                c.id === commentId ? { ...c, isHidden: true } : c
            ));
            
            const result = await adminModerationApi.hideComment(commentId);
            console.log('Hide comment result:', result);
            toast.success('Comment hidden successfully');
            
            // Refetch to ensure we have the latest data
            await fetchComments();
        } catch (error: any) {
            console.error('Error hiding comment:', error);
            toast.error(error.message || 'Failed to hide comment');
            // Revert optimistic update on error
            await fetchComments();
        }
    };

    const handleShowComment = async (commentId: number) => {
        try {
            // Optimistically update UI
            setComments(prev => prev.map(c => 
                c.id === commentId ? { ...c, isHidden: false } : c
            ));
            
            const result = await adminModerationApi.showComment(commentId);
            console.log('Show comment result:', result);
            toast.success('Comment shown successfully');
            
            // Refetch to ensure we have the latest data
            await fetchComments();
        } catch (error: any) {
            console.error('Error showing comment:', error);
            toast.error(error.message || 'Failed to show comment');
            // Revert optimistic update on error
            await fetchComments();
        }
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

    if (loading && !comments.length) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Comment Moderation</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSearch} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-sm font-medium mb-2 block">User Email</label>
                                <Input
                                    placeholder="Search by email..."
                                    value={searchEmail}
                                    onChange={(e) => setSearchEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-2 block">Blog ID</label>
                                <Input
                                    type="text"
                                    placeholder="Enter blog ID..."
                                    value={blogIdFilter}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        // Only allow numbers
                                        if (value === '' || /^\d+$/.test(value)) {
                                            setBlogIdFilter(value);
                                        }
                                    }}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-2 block">Sort By</label>
                                <select
                                    value={`${sortBy}-${sortDirection}`}
                                    onChange={(e) => {
                                        const [field, dir] = e.target.value.split('-');
                                        setSortBy(field as 'createdAt' | 'updatedAt');
                                        setSortDirection(dir as 'ASC' | 'DESC');
                                        setCurrentPage(0);
                                    }}
                                    className="w-full h-10 px-3 border border-gray-300 rounded-md"
                                >
                                    <option value="createdAt-DESC">Newest First</option>
                                    <option value="createdAt-ASC">Oldest First</option>
                                    <option value="updatedAt-DESC">Recently Updated</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button type="submit">
                                <Search className="w-4 h-4 mr-2" />
                                Search
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setSearchEmail('');
                                    setBlogIdFilter('');
                                    setCurrentPage(0);
                                    fetchComments();
                                }}
                            >
                                Clear Filters
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Comments List */}
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Comment</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Blog</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {comments.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center">
                                            {loading ? (
                                                <p className="text-gray-500">Loading comments...</p>
                                            ) : (
                                                <div>
                                                    <p className="text-gray-500 mb-2">No comments found</p>
                                                    <p className="text-xs text-gray-400">Backend moderation API may not be available yet</p>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ) : (
                                    comments.map((comment) => (
                                        <tr key={comment.id} className={comment.isHidden ? 'bg-gray-50' : ''}>
                                            <td className="px-6 py-4">
                                                <div className="max-w-xs">
                                                    <p className="text-sm text-gray-900 line-clamp-2">{comment.content}</p>
                                                    {comment.replyCount > 0 && (
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {comment.replyCount} {comment.replyCount === 1 ? 'reply' : 'replies'}
                                                        </p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-start gap-2">
                                                    <User className="w-4 h-4 text-gray-400 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">{comment.userName}</p>
                                                        <p className="text-xs text-gray-500 flex items-center gap-1">
                                                            <Mail className="w-3 h-3" />
                                                            {comment.userEmail}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="max-w-xs">
                                                    <p className="text-sm text-gray-900 line-clamp-1">{comment.blogTitle}</p>
                                                    <p className="text-xs text-gray-500">ID: {comment.blogId}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                                    <Calendar className="w-3 h-3" />
                                                    {formatDate(comment.createdAt)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {comment.isHidden ? (
                                                    <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-100">
                                                        Hidden
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
                                                        Visible
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    {comment.isHidden ? (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleShowComment(comment.id)}
                                                            title="Make comment visible"
                                                            className="gap-1.5"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                            <span>Show</span>
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleHideComment(comment.id)}
                                                            title="Hide comment from public"
                                                            className="gap-1.5"
                                                        >
                                                            <EyeOff className="w-4 h-4" />
                                                            <span>Hide</span>
                                                        </Button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDeleteComment(comment.id)}
                                                        title="Delete comment"
                                                        className="inline-flex items-center justify-center gap-1.5 h-8 px-3 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M3 6h18" />
                                                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                                        </svg>
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-6 py-4 border-t">
                            <div className="text-sm text-gray-600">
                                Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} comments
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                                    disabled={currentPage === 0}
                                >
                                    Previous
                                </Button>
                                <span className="px-4 py-2 text-sm">
                                    Page {currentPage + 1} of {totalPages}
                                </span>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                                    disabled={currentPage >= totalPages - 1}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
