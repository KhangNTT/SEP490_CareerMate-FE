"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { VideoCard } from "./VideoCard";
import { mockVideos } from "../types";
import {
    Search,
    Calendar,
    User,
    Star,
    MessageSquare,
    BookOpen,
    Clock,
    ChevronLeft,
    ChevronRight,
    Play
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

            const response = await publicBlogApi.filterBlogs({
                keyword: activeSearch || undefined,
                status: 'PUBLISHED',
                category: categoryFilter || undefined,
                ...commonParams
            });

            const blogs = response.content || [];
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

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const cats = await blogApi.getCategories();
                setCategories(cats);
            } catch (error: any) {
                setCategories([]);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchBlogs();
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
        return Math.ceil(textLength / 200);
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section - Dark Theme */}
            <div className="bg-gradient-to-b from-[#1a1a3e] to-[#0f0f23] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-24">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                            Career Insights & Resources
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Discover articles, tutorials, and videos to accelerate your career growth
                        </p>
                    </div>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                        <div className="relative">
                            <div className="flex bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Search articles..."
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-transparent text-white placeholder-gray-400 focus:outline-none"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                        {activeSearch && (
                            <div className="mt-3 flex items-center justify-center gap-2">
                                <span className="text-gray-400 text-sm">Showing results for "{activeSearch}"</span>
                                <button 
                                    type="button"
                                    onClick={handleClearSearch}
                                    className="text-blue-400 hover:text-blue-300 text-sm"
                                >
                                    Clear
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>

            {/* Main Content - Light Theme */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-8 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-muted-foreground" />
                        <span className="text-foreground font-medium">
                            {totalElements} {totalElements === 1 ? 'Article' : 'Articles'}
                        </span>
                    </div>
                    <div className="flex gap-3">
                        {categories.length > 0 && (
                            <select
                                value={categoryFilter}
                                onChange={(e) => {
                                    setCategoryFilter(e.target.value);
                                    setCurrentPage(0);
                                }}
                                className="h-10 px-4 border border-border rounded-lg bg-card text-foreground focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat.charAt(0) + cat.slice(1).toLowerCase()}
                                    </option>
                                ))}
                            </select>
                        )}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="h-10 px-4 border border-border rounded-lg bg-card text-foreground focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="createdAt,desc">Newest First</option>
                            <option value="createdAt,asc">Oldest First</option>
                            <option value="viewCount,desc">Most Viewed</option>
                            <option value="averageRating,desc">Highest Rated</option>
                        </select>
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-card rounded-xl overflow-hidden border border-border animate-pulse">
                                <div className="aspect-[16/9] bg-muted" />
                                <div className="p-5 space-y-3">
                                    <div className="h-5 bg-muted rounded w-3/4" />
                                    <div className="h-4 bg-muted rounded w-1/2" />
                                    <div className="h-4 bg-muted rounded w-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="text-center py-20">
                        <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-foreground mb-2">No articles found</h3>
                        <p className="text-muted-foreground">
                            {activeSearch || categoryFilter
                                ? 'Try adjusting your search or filters' 
                                : 'Check back later for new content'}
                        </p>
                    </div>
                ) : (
                    /* Blog Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {blogs.map((blog) => (
                            <Link key={blog.id} href={`/blog/${blog.id}`}>
                                <article className="group bg-card rounded-xl overflow-hidden border border-border hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                                    {/* Thumbnail */}
                                    <div className="aspect-[16/9] relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30">
                                        {blog.thumbnailUrl && !blog.thumbnailUrl.startsWith('blob:') ? (
                                            <img
                                                src={blog.thumbnailUrl}
                                                alt={blog.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <BookOpen className="w-12 h-12 text-blue-300" />
                                            </div>
                                        )}
                                        {/* Reading time badge */}
                                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {getReadingTime(blog.content)} min
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5 flex-1 flex flex-col">
                                        {/* Category tag if available */}
                                        {blog.category && (
                                            <span className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-2">
                                                {blog.category}
                                            </span>
                                        )}
                                        
                                        {/* Title */}
                                        <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                            {blog.title}
                                        </h3>

                                        {/* Excerpt */}
                                        <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-1">
                                            {blog.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                                        </p>

                                        {/* Meta info */}
                                        <div className="flex items-center justify-between pt-4 border-t border-border">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <User className="w-4 h-4" />
                                                <span className="truncate max-w-[100px]">{blog.authorName || 'Author'}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                {blog.averageRating && blog.averageRating > 0 && (
                                                    <div className="flex items-center gap-1">
                                                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                        <span>{blog.averageRating.toFixed(1)}</span>
                                                    </div>
                                                )}
                                                <span>{formatDate(blog.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-12">
                        <button
                            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                            disabled={currentPage === 0}
                            className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        
                        <div className="flex items-center gap-1">
                            {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                                let pageNum = i;
                                if (totalPages > 5) {
                                    if (currentPage < 3) {
                                        pageNum = i;
                                    } else if (currentPage > totalPages - 4) {
                                        pageNum = totalPages - 5 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }
                                }
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                                            currentPage === pageNum
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        {pageNum + 1}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                            disabled={currentPage >= totalPages - 1}
                            className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {/* Featured Videos Section - At Bottom */}
                <div className="mt-16 pt-12 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-600 rounded-lg">
                                <Play className="w-5 h-5 text-white" fill="currentColor" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">Featured Videos</h2>
                                <p className="text-sm text-gray-500">Quick tutorials to boost your skills</p>
                            </div>
                        </div>
                        <a 
                            href="https://www.youtube.com/@Fireship" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 transition-colors"
                        >
                            View all <ChevronRight className="w-4 h-4" />
                        </a>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {mockVideos.map(video => (
                            <VideoCard key={video.id} video={video} />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}