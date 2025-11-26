"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  BookOpen,
  Loader2,
  AlertCircle,
  X,
  Workflow,
  GraduationCap,
  ListChecks,
} from "lucide-react";
import { getRoadmapByName, getTopicDetail, getSubtopicDetail, Topic, Subtopic } from "@/lib/roadmap-api";
import toast from "react-hot-toast";

// Skeleton Loading Component
function SkeletonNode() {
  return (
    <div className="w-56 h-20 bg-gray-200 rounded-lg animate-pulse"></div>
  );
}

export default function RoadmapDetailPage() {
  const params = useParams();
  const router = useRouter();
  
  const roadmapName = decodeURIComponent(params.roadmapName as string);
  
  const [roadmapData, setRoadmapData] = useState<{ name: string; topics: Topic[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  
  // Side panel for detail view
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [detailContent, setDetailContent] = useState<{ name: string; description: string; resources: string[] } | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  useEffect(() => {
    if (roadmapName) {
      fetchRoadmapData();
    }
  }, [roadmapName]);

  const fetchRoadmapData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      
      const response = await getRoadmapByName(roadmapName);
      
      if (response.code === 200 && response.result) {
        setRoadmapData(response.result);
      } else {
        setError("Không thể tải roadmap");
        toast.error("Lỗi khi tải roadmap");
      }
    } catch (error: any) {
      console.error("Error fetching roadmap:", error);
      setError("Không thể tải roadmap. Vui lòng thử lại.");
      toast.error("Lỗi khi tải roadmap");
    } finally {
      setIsLoading(false);
    }
  }, [roadmapName]);

  const handleTopicClick = useCallback(async (topicId: number, topicName: string) => {
    setIsLoadingDetail(true);
    setShowDetailPanel(true);
    
    try {
      const detail = await getTopicDetail(topicId);
      setDetailContent({
        name: detail.name,
        description: detail.description,
        resources: detail.resourceResponses.map(r => r.url).filter(url => url),
      });
    } catch (error) {
      toast.error("Không thể tải thông tin chi tiết");
      setDetailContent({
        name: topicName,
        description: "No description available",
        resources: [],
      });
    } finally {
      setIsLoadingDetail(false);
    }
  }, []);

  const handleSubtopicClick = useCallback(async (subtopicId: number, subtopicName: string) => {
    setIsLoadingDetail(true);
    setShowDetailPanel(true);
    
    try {
      const detail = await getSubtopicDetail(subtopicId);
      setDetailContent({
        name: detail.name,
        description: detail.description,
        resources: detail.resourceResponses.map(r => r.url).filter(url => url),
      });
    } catch (error) {
      toast.error("Không thể tải thông tin chi tiết");
      setDetailContent({
        name: subtopicName,
        description: "No description available",
        resources: [],
      });
    } finally {
      setIsLoadingDetail(false);
    }
  }, []);

  const getTagColor = (tag: string) => {
    const lowerTag = tag.toLowerCase();
    if (lowerTag.includes("personal recommendation")) {
      return "bg-purple-500";
    }
    if (lowerTag.includes("alternative option")) {
      return "bg-green-500";
    }
    if (lowerTag.includes("order not strict")) {
      return "bg-gray-400";
    }
    return "";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <div className="h-10 bg-gray-200 rounded w-48 animate-pulse"></div>
          </div>
          <div className="flex flex-col items-center gap-24 py-12">
            <SkeletonNode />
            <SkeletonNode />
            <SkeletonNode />
          </div>
        </div>
      </div>
    );
  }

  if (error || !roadmapData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl p-8 text-center border border-gray-200 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Lỗi</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push("/candidate/road-map")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push("/candidate/road-map")}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Recommendations
            </button>
            <h1 className="text-2xl font-bold text-gray-900 capitalize">{roadmapData.name}</h1>
            <div className="flex gap-2">
              <button
                onClick={() => router.push(`/candidate/road-map-courses/${encodeURIComponent(roadmapName)}`)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white rounded-lg hover:from-teal-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg text-sm font-medium"
              >
                <ListChecks className="w-4 h-4" />
                Online Courses
              </button>
              <button
                onClick={() => router.push(`/candidate/road-map-flow/${encodeURIComponent(roadmapName)}`)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <Workflow className="w-4 h-4" />
                Flow View
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="bg-white rounded-lg border-2 border-gray-200 p-4 inline-block">
          <h3 className="font-bold text-sm text-gray-700 mb-3">Legend:</h3>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-purple-500"></div>
              <span className="text-gray-700">Personal Recommendation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-gray-700">Alternative Option</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gray-400"></div>
              <span className="text-gray-700">Order not strict on roadmap</span>
            </div>
          </div>
        </div>
      </div>

      {/* Roadmap Grid - 3 Topics per Row with Zigzag Connection */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="relative">
          {/* Group topics into rows of 3 */}
          {Array.from({ length: Math.ceil(roadmapData.topics.length / 3) }).map((_, rowIndex) => {
            const startIdx = rowIndex * 3;
            const rowTopics = roadmapData.topics.slice(startIdx, startIdx + 3);
            const isEvenRow = rowIndex % 2 === 0;
            
            // Reverse topics for odd rows to create zigzag pattern
            const displayTopics = isEvenRow ? rowTopics : [...rowTopics].reverse();
            
            return (
              <div key={rowIndex} className="mb-24">
                {/* Topics Row */}
                <div className={`flex ${isEvenRow ? 'justify-start' : 'justify-end'} gap-8`}>
                  {displayTopics.map((topic, indexInRow) => {
                    // Calculate actual topic index in original array
                    const actualIndexInRow = isEvenRow ? indexInRow : rowTopics.length - 1 - indexInRow;
                    const topicIndex = startIdx + actualIndexInRow;
                    const isLastInRow = indexInRow === displayTopics.length - 1;
                    const isLastTopic = topicIndex === roadmapData.topics.length - 1;
                    
                    return (
                      <div key={topic.id} className="relative flex flex-col items-center">
                        {/* Topic Card */}
                        <button
                          onClick={() => handleTopicClick(topic.id, topic.name)}
                          className="relative bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-4 rounded-xl font-bold text-center shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 w-64 border-2 border-yellow-600"
                        >
                          <div className="text-xs text-yellow-800 mb-2 font-semibold">Topic {topicIndex + 1}</div>
                          <div className="text-base">{topic.name}</div>
                          {topic.tags && (
                            <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full ${getTagColor(topic.tags)} border-2 border-white shadow-md`}></div>
                          )}
                        </button>

                        {/* Horizontal connector to next topic in same row */}
                        {!isLastInRow && (
                          <div className={`absolute top-1/2 w-8 h-1 bg-blue-500 ${isEvenRow ? '-right-8' : '-left-8'}`}></div>
                        )}

                        {/* Vertical + Horizontal connector to next row */}
                        {isLastInRow && !isLastTopic && (
                          <svg className="absolute" style={{ 
                            top: '50%',
                            left: isEvenRow ? '100%' : 'auto',
                            right: isEvenRow ? 'auto' : '100%',
                            width: '100px',
                            height: '120px'
                          }}>
                            {isEvenRow ? (
                              // Even row: go right then down then left to connect to rightmost of next row
                              <path
                                d="M 0 0 L 40 0 L 40 120 L 100 120"
                                fill="none"
                                stroke="#3b82f6"
                                strokeWidth="3"
                                markerEnd="url(#arrowhead)"
                              />
                            ) : (
                              // Odd row: go left then down then right to connect to leftmost of next row
                              <path
                                d="M 100 0 L 60 0 L 60 120 L 0 120"
                                fill="none"
                                stroke="#3b82f6"
                                strokeWidth="3"
                                markerEnd="url(#arrowhead)"
                              />
                            )}
                            <defs>
                              <marker
                                id="arrowhead"
                                markerWidth="10"
                                markerHeight="10"
                                refX="9"
                                refY="3"
                                orient="auto"
                              >
                                <polygon points="0 0, 10 3, 0 6" fill="#3b82f6" />
                              </marker>
                            </defs>
                          </svg>
                        )}

                        {/* Subtopics below topic */}
                        {topic.subtopics.length > 0 && (
                          <div className="mt-8 flex flex-col items-center gap-3">
                            {/* Connector line from topic to subtopics */}
                            <div className="w-1 h-6 border-l-2 border-dashed border-blue-400"></div>
                            
                            {/* Subtopics */}
                            <div className="flex flex-wrap gap-3 justify-center max-w-xs">
                              {topic.subtopics.map((subtopic) => (
                                <button
                                  key={subtopic.id}
                                  onClick={() => handleSubtopicClick(subtopic.id, subtopic.name)}
                                  className="relative bg-orange-300 hover:bg-orange-400 text-gray-900 px-4 py-2 rounded-lg font-semibold text-xs text-center shadow-md transition-all hover:shadow-lg hover:-translate-y-1 border-2 border-orange-500"
                                >
                                  {subtopic.name}
                                  {subtopic.tags && (
                                    <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${getTagColor(subtopic.tags)} border border-white shadow-sm`}></div>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Side Detail Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[480px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          showDetailPanel ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Panel Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <BookOpen className="w-6 h-6 flex-shrink-0" />
            <h2 className="text-xl font-bold truncate">
              {isLoadingDetail ? "Loading..." : detailContent?.name}
            </h2>
          </div>
          <button
            onClick={() => setShowDetailPanel(false)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Panel Content */}
        <div className="p-6 overflow-y-auto h-[calc(100vh-88px)]">
          {isLoadingDetail ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
              <p className="text-sm text-gray-600">Đang tải thông tin...</p>
            </div>
          ) : detailContent ? (
            <>
              {detailContent.description && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
                    <div className="w-1 h-4 bg-blue-600 rounded"></div>
                    Description
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-sm">{detailContent.description}</p>
                </div>
              )}
              
              {detailContent.resources.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
                    <div className="w-1 h-4 bg-blue-600 rounded"></div>
                    Resources
                  </h3>
                  <div className="space-y-3">
                    {detailContent.resources.map((url, idx) => (
                      <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group border border-blue-200"
                      >
                        <ExternalLink className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-blue-700 group-hover:text-blue-800 break-all flex-1">{url}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {!detailContent.description && detailContent.resources.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm">No additional information available</p>
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>

      {/* Overlay backdrop when panel is open */}
      {showDetailPanel && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity duration-300"
          onClick={() => setShowDetailPanel(false)}
        ></div>
      )}
    </div>
  );
}
