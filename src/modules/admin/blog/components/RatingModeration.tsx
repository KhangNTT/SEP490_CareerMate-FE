'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Trash2,
    Calendar,
    User,
    Mail,
    Star,
    TrendingUp,
    BarChart3,
    Award,
    X
} from 'lucide-react';
import { adminModerationApi, type AdminRatingResponse, type AdminRatingFilters, type RatingStatistics } from '@/lib/admin-moderation-api';
import toast from 'react-hot-toast';

export default function RatingModeration() {
    const [ratings, setRatings] = useState<AdminRatingResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    
    // Filters
    const [sortBy, setSortBy] = useState<'createdAt' | 'updatedAt' | 'rating'>('createdAt');
    const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('DESC');

    const pageSize = 20;

    useEffect(() => {
        fetchRatings();
    }, [currentPage, sortBy, sortDirection]);

    const fetchRatings = async () => {
        try {
            setLoading(true);
            
            const filters: AdminRatingFilters = {
                page: currentPage,
                size: pageSize,
                sortBy,
                sortDirection,
            };

            const response = await adminModerationApi.getAllRatings(filters);
            
            setRatings(response.content);
            setTotalPages(response.totalPages);
            setTotalElements(response.totalElements);
        } catch (error: any) {
            console.error('Error fetching ratings:', error);
            if (ratings.length > 0) {
                toast.error(error.message || 'Failed to fetch ratings');
            }
            setRatings([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRating = async (ratingId: number) => {
        if (!confirm('Are you sure you want to permanently delete this rating?')) {
            return;
        }

        try {
            await adminModerationApi.deleteRating(ratingId);
            toast.success('Rating deleted successfully');
            fetchRatings();
        } catch (error: any) {
            console.error('Error deleting rating:', error);
            toast.error(error.message || 'Failed to delete rating');
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

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-4 h-4 ${
                            star <= rating
                                ? 'text-yellow-500 fill-yellow-500'
                                : 'text-gray-300'
                        }`}
                    />
                ))}
            </div>
        );
    };

    if (loading && !ratings.length) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Ratings List */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Rating Moderation ({totalElements} total)</span>
                        <select
                            value={`${sortBy}-${sortDirection}`}
                            onChange={(e) => {
                                const [field, dir] = e.target.value.split('-');
                                setSortBy(field as 'createdAt' | 'updatedAt' | 'rating');
                                setSortDirection(dir as 'ASC' | 'DESC');
                                setCurrentPage(0);
                            }}
                            className="text-sm px-3 py-2 border border-gray-300 rounded-md"
                        >
                            <option value="createdAt-DESC">Newest First</option>
                            <option value="createdAt-ASC">Oldest First</option>
                            <option value="rating-DESC">Highest Rating</option>
                            <option value="rating-ASC">Lowest Rating</option>
                        </select>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Rating
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Blog
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center">
                                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                        </td>
                                    </tr>
                                ) : ratings.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                            No ratings found
                                        </td>
                                    </tr>
                                ) : (
                                    ratings.map((rating) => (
                                        <tr key={rating.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
                                                        <User className="w-3 h-3" />
                                                        {rating.userName}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                                        <Mail className="w-3 h-3" />
                                                        {rating.userEmail}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {renderStars(rating.rating)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="max-w-xs">
                                                    <p className="text-sm text-gray-900 line-clamp-1">{rating.blogTitle}</p>
                                                    <p className="text-xs text-gray-500">ID: {rating.blogId}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                                    <Calendar className="w-3 h-3" />
                                                    {formatDate(rating.createdAt)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end">
                                                    <button
                                                        onClick={() => handleDeleteRating(rating.id)}
                                                        title="Delete rating"
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
                        <div className="flex items-center justify-between mt-6 pt-4 border-t">
                            <div className="text-sm text-gray-600">
                                Showing page {currentPage + 1} of {totalPages}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                                    disabled={currentPage === 0}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
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
