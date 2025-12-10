'use client';

import { useState } from 'react';
import { MessageSquare, Star } from 'lucide-react';
import CommentModeration from '@/modules/admin/blog/components/CommentModeration';
import RatingModeration from '@/modules/admin/blog/components/RatingModeration';

export default function ModerationPage() {
    const [activeTab, setActiveTab] = useState('comments');

    return (
        <div className="w-full">
            <div className="mb-4 lg:mb-6">
                <h1 className="text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900">Content Moderation</h1>
                <p className="text-sm lg:text-base text-gray-600 mt-1 lg:mt-2">Manage user comments and ratings across all blog posts</p>
            </div>

            <div className="space-y-4 lg:space-y-6">
                {/* Tab Navigation */}
                <div className="border-b border-gray-200">
                    <nav className="flex gap-6 lg:gap-8">
                        <button
                            onClick={() => setActiveTab('comments')}
                            className={`flex items-center gap-2 py-3 lg:py-4 px-1 border-b-2 font-medium text-sm lg:text-base transition-colors ${
                                activeTab === 'comments'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            <MessageSquare className="w-4 h-4 lg:w-5 lg:h-5" />
                            Comments
                        </button>
                        <button
                            onClick={() => setActiveTab('ratings')}
                            className={`flex items-center gap-2 py-3 lg:py-4 px-1 border-b-2 font-medium text-sm lg:text-base transition-colors ${
                                activeTab === 'ratings'
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            <Star className="w-4 h-4 lg:w-5 lg:h-5" />
                            Ratings
                        </button>
                    </nav>
                </div>

                {/* Tab Content */}
                {activeTab === 'comments' && <CommentModeration />}
                {activeTab === 'ratings' && <RatingModeration />}
            </div>
        </div>
    );
}
