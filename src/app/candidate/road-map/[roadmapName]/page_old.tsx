"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  ArrowLeft,
  ExternalLink,
  BookOpen,
  Loader2,
  AlertCircle,
  X,
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
  
  // Track expanded topics to show/hide subtopics
  const [expandedTopics, setExpandedTopics] = useState<Set<number>>(new Set());
  
  // ReactFlow states
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (roadmapName) {
      fetchRoadmapData();
    }
  }, [roadmapName]);

  // Build ReactFlow nodes and edges when roadmapData changes
  useEffect(() => {
    if (!roadmapData) return;

    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    const topicsPerRow = 3;
    const horizontalSpacing = 350;
    const verticalSpacing = 250;

    // Add START node
    newNodes.push({
      id: 'start',
      type: 'default',
      position: { x: 50, y: 0 },
      data: { 
        label: (
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl border-4 border-white">
            <span className="text-white font-bold text-xs">START</span>
          </div>
        ) 
      },
      style: { background: 'transparent', border: 'none' },
    });

    // Process topics
    roadmapData.topics.forEach((topic, index) => {
      const row = Math.floor(index / topicsPerRow);
      const col = index % topicsPerRow;
      const isEvenRow = row % 2 === 0;
      
      // Calculate visual column (reverse for odd rows)
      const visualCol = isEvenRow ? col : (topicsPerRow - 1 - col);
      
      const x = visualCol * horizontalSpacing + 150;
      const y = row * verticalSpacing + 150;
      
      const isExpanded = expandedTopics.has(topic.id);

      // Topic node
      newNodes.push({
        id: `topic-${topic.id}`,
        type: 'default',
        position: { x, y },
        data: { 
          label: (
            <div className="flex flex-col items-center">
              <button
                onClick={() => {
                  if (topic.subtopics.length > 0) {
                    toggleTopicExpand(topic.id);
                  }
                  handleTopicClick(topic.id, topic.name);
                }}
                className="relative bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-full font-bold text-center shadow-xl transition-all duration-300 hover:shadow-purple-500/50 hover:scale-110 w-20 h-20 flex flex-col items-center justify-center border-4 border-white"
              >
                <div className="w-6 h-6 bg-white text-purple-700 rounded-full flex items-center justify-center font-bold text-xs shadow-md mb-1">
                  {index + 1}
                </div>
                {topic.tags && (
                  <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full ${getTagColor(topic.tags)} border-2 border-white shadow-lg`}></div>
                )}
                {topic.subtopics.length > 0 && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-white text-purple-700 rounded-full p-0.5 shadow-md">
                    <svg 
                      className={`w-3 h-3 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                )}
              </button>
              <span className="text-purple-800 font-bold text-xs uppercase mt-2 max-w-[120px] text-center leading-tight">
                {topic.name}
              </span>
            </div>
          ) 
        },
        style: { background: 'transparent', border: 'none', width: 140, height: 120 },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      });

      // Add edge from previous topic
      if (index === 0) {
        newEdges.push({
          id: `e-start-topic-${topic.id}`,
          source: 'start',
          target: `topic-${topic.id}`,
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#6b7280', strokeWidth: 3 },
        });
      } else {
        newEdges.push({
          id: `e-topic-${roadmapData.topics[index - 1].id}-topic-${topic.id}`,
          source: `topic-${roadmapData.topics[index - 1].id}`,
          target: `topic-${topic.id}`,
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#6b7280', strokeWidth: 3 },
        });
      }

      // Add subtopic nodes if expanded
      if (isExpanded && topic.subtopics.length > 0) {
        topic.subtopics.forEach((subtopic, subIndex) => {
          const subX = x - 100 + (subIndex * 100);
          const subY = y + 100;

          newNodes.push({
            id: `subtopic-${subtopic.id}`,
            type: 'default',
            position: { x: subX, y: subY },
            data: { 
              label: (
                <button
                  onClick={() => handleSubtopicClick(subtopic.id, subtopic.name)}
                  className="relative bg-gradient-to-br from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-3 py-2 rounded-xl font-semibold text-[10px] text-center shadow-md transition-all duration-300 hover:shadow-orange-500/50 hover:scale-105 border-2 border-white"
                >
                  {subtopic.name}
                  {subtopic.tags && (
                    <div className={`absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full ${getTagColor(subtopic.tags)} border border-white shadow-sm`}></div>
                  )}
                </button>
              ) 
            },
            style: { background: 'transparent', border: 'none', width: 100, height: 50 },
          });

          // Edge from topic to subtopic
          newEdges.push({
            id: `e-topic-${topic.id}-subtopic-${subtopic.id}`,
            source: `topic-${topic.id}`,
            target: `subtopic-${subtopic.id}`,
            type: 'straight',
            style: { stroke: '#a855f7', strokeWidth: 2, strokeDasharray: '5,5' },
          });
        });
      }
    });

    // Add FINISH node
    const lastIndex = roadmapData.topics.length - 1;
    const lastRow = Math.floor(lastIndex / topicsPerRow);
    const lastCol = lastIndex % topicsPerRow;
    const isLastRowEven = lastRow % 2 === 0;
    const lastVisualCol = isLastRowEven ? lastCol : (topicsPerRow - 1 - lastCol);
    
    const finishX = lastVisualCol * horizontalSpacing + 150;
    const finishY = lastRow * verticalSpacing + 350;

    newNodes.push({
      id: 'finish',
      type: 'default',
      position: { x: finishX, y: finishY },
      data: { 
        label: (
          <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl border-4 border-white">
            <div className="text-center">
              <div className="text-white font-bold text-sm">FINISH</div>
              <div className="text-white text-lg">🎉</div>
            </div>
          </div>
        ) 
      },
      style: { background: 'transparent', border: 'none' },
    });

    // Edge from last topic to finish
    if (roadmapData.topics.length > 0) {
      newEdges.push({
        id: `e-topic-${roadmapData.topics[lastIndex].id}-finish`,
        source: `topic-${roadmapData.topics[lastIndex].id}`,
        target: 'finish',
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#6b7280', strokeWidth: 3 },
      });
    }

    setNodes(newNodes);
    setEdges(newEdges);
  }, [roadmapData, expandedTopics]);

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

  const toggleTopicExpand = useCallback((topicId: number) => {
    setExpandedTopics(prev => {
      const newSet = new Set(prev);
      if (newSet.has(topicId)) {
        newSet.delete(topicId);
      } else {
        newSet.add(topicId);
      }
      return newSet;
    });
  }, []);

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
            <div className="w-32"></div> {/* Spacer for centering */}
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
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
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
            <h1 className="text-2xl font-bold text-gray-900 capitalize">{roadmapData?.name || roadmapName}</h1>
            <div className="w-32"></div>
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

      {/* ReactFlow Canvas */}
      <div className="w-full" style={{ height: 'calc(100vh - 200px)' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          fitView
          attributionPosition="bottom-left"
          minZoom={0.5}
          maxZoom={1.5}
          defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        >
          <Controls />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} color="#e5e7eb" />
        </ReactFlow>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>

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
