"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BlogCard } from "./BlogCard";
import { VideoCard } from "./VideoCard";
import { mockVideos } from "../types";
import {
    Search,
    Calendar,
    User,
    Star,
    MessageSquare,
    BookOpen,
    Clock
} from 'lucide-react';
import { blogApi } from '@/lib/blog-api';
import { publicBlogApi } from '@/lib/public-blog-api';
import { Blog } from '@/types/blog';
import toast from 'react-hot-toast';

export function BlogList() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchInput, setSearchInput] = useState('');
    const [activeSearch, setActiveSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('createdAt,desc');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [categories, setCategories] = useState<string[]>([]);

    const pageSize = 12;

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
            const response = await publicBlogApi.filterBlogs({
                keyword: activeSearch || undefined,
                status: 'PUBLISHED', // Public users only see published blogs
                category: categoryFilter || undefined,
                ...commonParams
            });

            console.log('📦 Public - Response:', response);

            const blogs = response.content || [];

            // Check for blob URLs and log warnings
            blogs.forEach(blog => {
                if (blog.thumbnailUrl?.startsWith('blob:')) {
                    console.warn('⚠️ BLOB URL DETECTED IN BLOG LIST:', {
                        blogId: blog.id,
                        title: blog.title,
                        thumbnailUrl: blog.thumbnailUrl,
                        message: 'This blog has a blob URL stored as thumbnail - needs database cleanup'
                    });
                }
            });

            setBlogs(blogs);
            setTotalPages(response.totalPages || 0);
            setTotalElements(response.totalElements || 0);
        } catch (error: any) {
            console.error('❌ Public blog API error:', error);
            toast.error('Unable to load blogs at this time');
            setBlogs([]);
        } finally {
            setLoading(false);
        }
    }, [currentPage, activeSearch, categoryFilter, sortBy]);

    // Fetch available categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const cats = await blogApi.getCategories();
                setCategories(cats);
                console.log('📁 Categories loaded:', cats);
            } catch (error: any) {
                console.warn('📁 Categories not available:', error.message);
                // Categories are optional, continue without them
                setCategories([]);
            }
        };
        fetchCategories();
    }, []);

    // Fetch blogs when filters change
    useEffect(() => {
        fetchBlogs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, activeSearch, categoryFilter, sortBy]);

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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getReadingTime = (content: string) => {
        const textLength = content.replace(/<[^>]*>/g, '').split(' ').length;
        const readingTime = Math.ceil(textLength / 200); // Average reading speed: 200 words per minute
        return readingTime;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    // Public blog viewing now works without authentication!

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">{/* Added margin-top for fixed header */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Column - Blog Posts */}
                    <div className="lg:col-span-3">
                        {/* Search and Filters */}
                        <div className="mb-6 space-y-4">
                            <form onSubmit={handleSearch} className="flex gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        placeholder="Search blog posts (press Enter)..."
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <Button type="submit" size="sm">
                                    Search
                                </Button>
                                {activeSearch && (
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        size="sm"
                                        onClick={handleClearSearch}
                                    >
                                        Clear
                                    </Button>
                                )}
                            </form>
                            <div className="flex gap-4">
                                {/* Only show category filter if categories are available */}
                                {categories.length > 0 && (
                                    <div className="flex-1">
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
                                )}
                                <div className={categories.length > 0 ? "flex-1" : "w-full"}>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-full h-10 px-4 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="createdAt,desc">Newest First</option>
                                        <option value="createdAt,asc">Oldest First</option>
                                        <option value="viewCount,desc">Most Viewed</option>
                                        <option value="averageRating,desc">Highest Rated</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {blogs.length === 0 ? (
                                <div className="text-center py-12">
                                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">
                                        {activeSearch || categoryFilter
                                            ? 'No blog posts match your search criteria' 
                                            : 'No blog posts available at the moment'}
                                    </p>
                                </div>
                            ) : (
                                blogs.map((blog) => (
                                    <Link key={blog.id} href={`/blog/${blog.id}`}>
                                        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden">
                                            <CardContent className="p-0">
                                                <div className="flex flex-row h-full">
                                                    {/* Thumbnail Section */}
                                                    <div className="w-48 flex-shrink-0 relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                                                        {blog.thumbnailUrl && !blog.thumbnailUrl.startsWith('blob:') ? (
                                                            <img
                                                                src={blog.thumbnailUrl}
                                                                alt={blog.title}
                                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                                onError={(e) => {
                                                                    e.currentTarget.style.display = 'none';
                                                                    e.currentTarget.parentElement!.innerHTML = `
                                                                        <div class="w-full h-full flex items-center justify-center">
                                                                            <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                            </svg>
                                                                        </div>
                                                                    `;
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <BookOpen className="w-16 h-16 text-gray-400" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Content Section */}
                                                    <div className="flex-1 p-6 flex flex-col justify-between">
                                                        <div>
                                                            {/* Title */}
                                                            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                                {blog.title}
                                                            </h3>

                                                            {/* Author and Date */}
                                                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                                                <div className="flex items-center gap-1">
                                                                    <User className="w-4 h-4" />
                                                                    {blog.authorName || 'Unknown Author'}
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <Calendar className="w-4 h-4" />
                                                                    {formatDate(blog.createdAt)}
                                                                </div>
                                                            </div>

                                                            {/* Excerpt */}
                                                            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                                                                {blog.content.replace(/<[^>]*>/g, '').substring(0, 120)}...
                                                            </p>
                                                        </div>

                                                        {/* Bottom Section - Stats */}
                                                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                                {blog.averageRating && blog.averageRating > 0 && (
                                                                    <div className="flex items-center gap-1">
                                                                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                                        <span className="font-medium">{blog.averageRating.toFixed(1)}</span>
                                                                    </div>
                                                                )}
                                                                {blog.commentCount && blog.commentCount > 0 && (
                                                                    <div className="flex items-center gap-1">
                                                                        <MessageSquare className="w-4 h-4" />
                                                                        {blog.commentCount}
                                                                    </div>
                                                                )}
                                                                <div className="flex items-center gap-1">
                                                                    <Clock className="w-4 h-4" />
                                                                    {getReadingTime(blog.content)} min read
                                                                </div>
                                                            </div>
                                                            
                                                            <span className="text-blue-600 font-medium text-sm group-hover:gap-2 flex items-center gap-1 transition-all">
                                                                Read more
                                                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center space-x-2 mt-8">
                                <button
                                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                                    disabled={currentPage === 0}
                                    className="px-3 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    &lt;
                                </button>

                                <span className="text-sm text-gray-600 px-4">
                                    Page {currentPage + 1} of {totalPages}
                                </span>

                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                                    disabled={currentPage >= totalPages - 1}
                                    className="px-3 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    &gt;
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Videos */}
                    <div className="lg:col-span-1">
                        <div className="space-y-4">
                            {mockVideos.slice(0, 6).map(video => (
                                <VideoCard key={video.id} video={video} />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}