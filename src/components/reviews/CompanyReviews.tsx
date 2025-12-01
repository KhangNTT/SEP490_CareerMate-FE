"use client";

import { useState, useEffect } from "react";
import { Star, ThumbsUp, User, Building2, Filter, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getCompanyReviews,
  getCompanyStatistics,
  type ReviewResponse,
  type CompanyStatisticsResponse
} from "@/lib/review-api";

interface CompanyReviewsProps {
  recruiterId: number;
  companyName?: string;
}

export default function CompanyReviews({ recruiterId, companyName }: CompanyReviewsProps) {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [statistics, setStatistics] = useState<CompanyStatisticsResponse | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'APPLICATION' | 'INTERVIEW' | 'WORK'>('ALL');
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    loadReviews();
  }, [recruiterId, filter]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      
      const [reviewsData, statsData] = await Promise.all([
        getCompanyReviews(recruiterId, {
          reviewType: filter === 'ALL' ? undefined : filter,
          size: expanded ? 20 : 5
        }),
        getCompanyStatistics(recruiterId)
      ]);
      
      setReviews(reviewsData.reviews || []);
      setStatistics(statsData);
    } catch (error) {
      console.error("Failed to load reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number, size: 'sm' | 'md' = 'sm') => {
    const sizeClass = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClass} ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  const getReviewTypeBadge = (type: string) => {
    const config: Record<string, { label: string; className: string }> = {
      APPLICATION: { label: 'Application', className: 'bg-blue-100 text-blue-800' },
      INTERVIEW: { label: 'Interview', className: 'bg-purple-100 text-purple-800' },
      WORK: { label: 'Work Experience', className: 'bg-green-100 text-green-800' }
    };
    const { label, className } = config[type] || { label: type, className: 'bg-gray-100 text-gray-800' };
    return <Badge className={className}>{label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading && !statistics) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Statistics */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600 fill-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Company Reviews</h3>
                <p className="text-sm text-gray-500">
                  {statistics?.totalReviews || 0} reviews from employees & applicants
                </p>
              </div>
            </div>
            {statistics && (
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {statistics.averageRating?.toFixed(1) || '0.0'}
                  </span>
                  {renderStars(Math.round(statistics.averageRating || 0), 'md')}
                </div>
                <p className="text-sm text-gray-500">
                  {statistics.wouldRecommendPercentage || 0}% would recommend
                </p>
              </div>
            )}
          </div>
        </CardHeader>
        
        {statistics && (
          <CardContent className="pt-0">
            {/* Rating Distribution */}
            <div className="grid grid-cols-5 gap-2 mb-4">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = statistics[`${['one', 'two', 'three', 'four', 'five'][rating - 1]}StarCount` as keyof CompanyStatisticsResponse] as number || 0;
                const percentage = statistics.totalReviews ? (count / statistics.totalReviews) * 100 : 0;
                return (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-3">{rating}</span>
                    <Progress value={percentage} className="h-2 flex-1" />
                    <span className="text-xs text-gray-500 w-6">{count}</span>
                  </div>
                );
              })}
            </div>

            {/* Review Type Breakdown */}
            <div className="flex gap-4 pt-3 border-t">
              <div className="text-center">
                <p className="text-lg font-semibold text-blue-600">{statistics.applicationReviews || 0}</p>
                <p className="text-xs text-gray-500">Application</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-purple-600">{statistics.interviewReviews || 0}</p>
                <p className="text-xs text-gray-500">Interview</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-green-600">{statistics.workReviews || 0}</p>
                <p className="text-xs text-gray-500">Work</p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Filter className="h-4 w-4 text-gray-500" />
        <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Reviews</SelectItem>
            <SelectItem value="APPLICATION">Application Reviews</SelectItem>
            <SelectItem value="INTERVIEW">Interview Reviews</SelectItem>
            <SelectItem value="WORK">Work Experience</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h4 className="font-medium text-gray-900 mb-1">No Reviews Yet</h4>
            <p className="text-sm text-gray-500">
              Be the first to share your experience with this company.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {review.isAnonymous ? 'Anonymous' : review.candidateName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {review.jobTitle} • {formatDate(review.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getReviewTypeBadge(review.reviewType)}
                    {renderStars(review.overallRating)}
                  </div>
                </div>

                <h4 className="font-semibold text-gray-900 mb-2">{review.reviewTitle}</h4>
                <p className="text-sm text-gray-700 mb-4">{review.reviewText}</p>

                {/* Pros & Cons */}
                {(review.pros || review.cons) && (
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    {review.pros && (
                      <div className="bg-green-50 rounded-lg p-3">
                        <p className="text-xs font-medium text-green-700 mb-1">Pros</p>
                        <p className="text-sm text-green-800">{review.pros}</p>
                      </div>
                    )}
                    {review.cons && (
                      <div className="bg-red-50 rounded-lg p-3">
                        <p className="text-xs font-medium text-red-700 mb-1">Cons</p>
                        <p className="text-sm text-red-800">{review.cons}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Would Recommend */}
                <div className="flex items-center gap-4 pt-3 border-t">
                  {review.wouldRecommend !== undefined && (
                    <div className="flex items-center gap-2 text-sm">
                      <ThumbsUp className={`h-4 w-4 ${review.wouldRecommend ? 'text-green-600' : 'text-gray-400'}`} />
                      <span className={review.wouldRecommend ? 'text-green-700' : 'text-gray-500'}>
                        {review.wouldRecommend ? 'Recommends' : 'Does not recommend'}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <ThumbsUp className="h-3 w-3" />
                    <span>{review.helpfulCount || 0} found helpful</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Show More / Less Button */}
          {(statistics?.totalReviews || 0) > 5 && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setExpanded(!expanded);
                if (!expanded) loadReviews();
              }}
            >
              <ChevronDown className={`h-4 w-4 mr-2 ${expanded ? 'rotate-180' : ''}`} />
              {expanded ? 'Show Less' : `Show All ${statistics?.totalReviews} Reviews`}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
