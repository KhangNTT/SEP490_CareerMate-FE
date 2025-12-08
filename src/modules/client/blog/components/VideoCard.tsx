"use client";

import { VideoContent } from "../types";
import { Play } from "lucide-react";

interface VideoCardProps {
    video: VideoContent;
}

// Format view count (e.g., 1.2M, 500K)
const formatViews = (views: number | undefined): string => {
    if (!views) return '';
    if (views >= 1000000) {
        return `${(views / 1000000).toFixed(1)}M`;
    }
    if (views >= 1000) {
        return `${(views / 1000).toFixed(0)}K`;
    }
    return `${views}`;
};

export function VideoCard({ video }: VideoCardProps) {
    const handleClick = () => {
        window.open(`https://www.youtube.com/watch?v=${video.youtubeId}`, '_blank');
    };

    return (
        <div 
            className="group bg-white rounded-xl overflow-hidden cursor-pointer border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-200"
            onClick={handleClick}
        >
            {/* Video Thumbnail */}
            <div className="relative aspect-video">
                <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.currentTarget.src = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
                    }}
                />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all shadow-lg">
                        <Play className="w-5 h-5 text-white ml-0.5" fill="currentColor" />
                    </div>
                </div>

                {/* Duration Badge */}
                {video.duration && (
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-medium px-1.5 py-0.5 rounded">
                        {video.duration}
                    </div>
                )}
            </div>

            {/* Video Info */}
            <div className="p-3">
                <h3 className="text-gray-900 text-sm font-medium leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
                    {video.title}
                </h3>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-500">
                    <span className="font-medium text-gray-600">{video.channel}</span>
                    <span>•</span>
                    <span>{formatViews(video.views)} views</span>
                </div>
            </div>
        </div>
    );
}
