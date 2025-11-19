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
  CheckCircle2,
  Circle,
  ChevronRight,
} from "lucide-react";
import { getRoadmapByName, getTopicDetail, getSubtopicDetail, Topic, Subtopic } from "@/lib/roadmap-api";
import toast from "react-hot-toast";

// Skeleton Loading Component
function SkeletonCard() {
  return (
    <div className="w-full h-48 bg-gray-200 rounded-xl animate-pulse"></div>
  );
}

// Subtopics Popup Modal
function SubtopicsModal({ 
  topic, 
  subtopics, 
  onClose, 
  onSubtopicClick 
}: { 
  topic: string;
  subtopics: Subtopic[];
  onClose: () => void;
  onSubtopicClick: (subtopic: Subtopic) => void;
}) {
  const getTagColor = (tag: string) => {
    const lowerTag = tag.toLowerCase();
    if (lowerTag.includes("personal recommendation")) {
      return "bg-purple-100 text-purple-700 border-purple-300";
    }
    if (lowerTag.includes("alternative option")) {
      return "bg-green-100 text-green-700 border-green-300";
    }
    if (lowerTag.includes("order not strict")) {
      return "bg-gray-100 text-gray-700 border-gray-300";
    }
    return "bg-blue-100 text-blue-700 border-blue-300";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0000005b] bg-opacity-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6" />
              <h2 className="text-xl font-bold">Subtopics: {topic}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {subtopics.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm">No subtopics available</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {subtopics.map((subtopic, index) => (
                <button
                  key={subtopic.id}
                  onClick={() => onSubtopicClick(subtopic)}
                  className={`text-left p-4 rounded-lg border-2 transition-all hover:shadow-lg hover:-translate-y-1 ${getTagColor(subtopic.tags || "")}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{subtopic.name}</h3>
                    </div>
                    <ChevronRight className="w-5 h-5 opacity-50" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Topic Card Component
function TopicCard({
  topic,
  index,
  isCompleted,
  onToggleComplete,
  onViewSubtopics,
  description,
  resources,
}: {
  topic: Topic;
  index: number;
  isCompleted: boolean;
  onToggleComplete: () => void;
  onViewSubtopics: () => void;
  description?: string;
  resources?: string[];
}) {
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

  return (
    <div className={`relative bg-white rounded-xl shadow-lg border-2 transition-all hover:shadow-xl ${
      isCompleted ? 'border-green-500 bg-green-50' : 'border-gray-200'
    }`}>
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-xl relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white text-blue-600 font-bold flex items-center justify-center shadow-md">
              {index + 1}
            </div>
            <div className="flex-1">
              <div className="text-xs opacity-90 mb-1">Topic {index + 1}</div>
              <h3 className="font-bold text-lg">{topic.name}</h3>
            </div>
          </div>
          <button
            onClick={onToggleComplete}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            {isCompleted ? (
              <CheckCircle2 className="w-6 h-6 text-green-300" />
            ) : (
              <Circle className="w-6 h-6" />
            )}
          </button>
        </div>
        {topic.tags && (
          <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full ${getTagColor(topic.tags)} border-2 border-white shadow-md`}></div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Description */}
        {description && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <div className="w-1 h-4 bg-blue-600 rounded"></div>
              Mô tả
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{description}</p>
          </div>
        )}

        {/* Resources */}
        {resources && resources.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <div className="w-1 h-4 bg-blue-600 rounded"></div>
              Tài liệu học
            </h4>
            <div className="space-y-2">
              {resources.slice(0, 2).map((url, idx) => (
                <a
                  key={idx}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-xs group"
                >
                  <ExternalLink className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span className="text-blue-700 group-hover:text-blue-800 truncate flex-1">{url}</span>
                </a>
              ))}
              {resources.length > 2 && (
                <p className="text-xs text-gray-500 italic">+{resources.length - 2} more resources</p>
              )}
            </div>
          </div>
        )}

        {/* Subtopics Button */}
        {topic.subtopics.length > 0 && (
          <button
            onClick={onViewSubtopics}
            className="w-full mt-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg font-semibold text-sm flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            Xem {topic.subtopics.length} Subtopics
          </button>
        )}
      </div>
    </div>
  );
}

export default function RoadmapLearningPage() {
  const params = useParams();
  const router = useRouter();
  
  const roadmapName = decodeURIComponent(params.roadmapName as string);
  
  const [roadmapData, setRoadmapData] = useState<{ name: string; topics: Topic[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  
  // Track completed topics
  const [completedTopics, setCompletedTopics] = useState<Set<number>>(new Set());
  
  // Popup states
  const [showSubtopicsModal, setShowSubtopicsModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  
  // Side panel for subtopic detail
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [detailContent, setDetailContent] = useState<{ name: string; description: string; resources: string[] } | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  // Topic details cache
  const [topicDetails, setTopicDetails] = useState<Map<number, { description: string; resources: string[] }>>(new Map());

  useEffect(() => {
    if (roadmapName) {
      fetchRoadmapData();
    }
  }, [roadmapName]);

  useEffect(() => {
    // Load completed topics from localStorage
    const saved = localStorage.getItem(`roadmap-progress-${roadmapName}`);
    if (saved) {
      try {
        const ids = JSON.parse(saved);
        setCompletedTopics(new Set(ids));
      } catch (error) {
        console.error('Error loading progress:', error);
      }
    }
  }, [roadmapName]);

  const fetchRoadmapData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      
      const response = await getRoadmapByName(roadmapName);
      
      if (response.code === 200 && response.result) {
        setRoadmapData(response.result);
        // Fetch details for all topics
        fetchAllTopicDetails(response.result.topics);
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

  const fetchAllTopicDetails = async (topics: Topic[]) => {
    const detailsMap = new Map();
    
    for (const topic of topics) {
      try {
        const detail = await getTopicDetail(topic.id);
        detailsMap.set(topic.id, {
          description: detail.description,
          resources: detail.resourceResponses.map(r => r.url).filter(url => url),
        });
      } catch (error) {
        console.error(`Error fetching detail for topic ${topic.id}:`, error);
      }
    }
    
    setTopicDetails(detailsMap);
  };

  const handleToggleComplete = useCallback((topicId: number) => {
    setCompletedTopics(prev => {
      const newSet = new Set(prev);
      if (newSet.has(topicId)) {
        newSet.delete(topicId);
      } else {
        newSet.add(topicId);
      }
      
      // Save to localStorage
      localStorage.setItem(`roadmap-progress-${roadmapName}`, JSON.stringify(Array.from(newSet)));
      return newSet;
    });
  }, [roadmapName]);

  const handleViewSubtopics = useCallback((topic: Topic) => {
    setSelectedTopic(topic);
    setShowSubtopicsModal(true);
  }, []);

  const handleSubtopicClick = useCallback(async (subtopic: Subtopic) => {
    setIsLoadingDetail(true);
    setShowDetailPanel(true);
    setShowSubtopicsModal(false);
    
    try {
      const detail = await getSubtopicDetail(subtopic.id);
      setDetailContent({
        name: detail.name,
        description: detail.description,
        resources: detail.resourceResponses.map(r => r.url).filter(url => url),
      });
    } catch (error) {
      toast.error("Không thể tải thông tin chi tiết");
      setDetailContent({
        name: subtopic.name,
        description: "No description available",
        resources: [],
      });
    } finally {
      setIsLoadingDetail(false);
    }
  }, []);

  const calculateProgress = () => {
    if (!roadmapData) return 0;
    return Math.round((completedTopics.size / roadmapData.topics.length) * 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <div className="h-10 bg-gray-200 rounded w-48 animate-pulse"></div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>
    );
  }

  if (error || !roadmapData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl p-8 text-center border border-gray-200 max-w-md shadow-xl">
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

  const progress = calculateProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.push("/candidate/road-map")}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </button>
            <h1 className="text-2xl font-bold text-gray-900 capitalize">{roadmapData.name}</h1>
            <div className="text-sm text-gray-600">
              {completedTopics.size}/{roadmapData.topics.length} completed
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-600 h-full rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-2"
              style={{ width: `${progress}%` }}
            >
              {progress > 10 && (
                <span className="text-xs font-bold text-white">{progress}%</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Topic Cards Grid */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {roadmapData.topics.map((topic, index) => {
            const details = topicDetails.get(topic.id);
            return (
              <TopicCard
                key={topic.id}
                topic={topic}
                index={index}
                isCompleted={completedTopics.has(topic.id)}
                onToggleComplete={() => handleToggleComplete(topic.id)}
                onViewSubtopics={() => handleViewSubtopics(topic)}
                description={details?.description}
                resources={details?.resources}
              />
            );
          })}
        </div>
      </div>

      {/* Subtopics Modal */}
      {showSubtopicsModal && selectedTopic && (
        <SubtopicsModal
          topic={selectedTopic.name}
          subtopics={selectedTopic.subtopics}
          onClose={() => setShowSubtopicsModal(false)}
          onSubtopicClick={handleSubtopicClick}
        />
      )}

      {/* Side Detail Panel for Subtopics */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[480px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          showDetailPanel ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Panel Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 flex items-center justify-between">
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
              <Loader2 className="w-8 h-8 text-purple-600 animate-spin mx-auto mb-3" />
              <p className="text-sm text-gray-600">Đang tải thông tin...</p>
            </div>
          ) : detailContent ? (
            <>
              {detailContent.description && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
                    <div className="w-1 h-4 bg-purple-600 rounded"></div>
                    Mô tả
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-sm">{detailContent.description}</p>
                </div>
              )}
              
              {detailContent.resources.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
                    <div className="w-1 h-4 bg-purple-600 rounded"></div>
                    Tài liệu học
                  </h3>
                  <div className="space-y-3">
                    {detailContent.resources.map((url, idx) => (
                      <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group border border-purple-200"
                      >
                        <ExternalLink className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-purple-700 group-hover:text-purple-800 break-all flex-1">{url}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {!detailContent.description && detailContent.resources.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm">Không có thông tin chi tiết</p>
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
