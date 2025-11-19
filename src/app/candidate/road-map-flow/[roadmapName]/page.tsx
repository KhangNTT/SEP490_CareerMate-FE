"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  BookOpen,
  Loader2,
  AlertCircle,
  X,
  Maximize2,
  Minimize2,
  Save,
  RotateCcw,
} from "lucide-react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
  BackgroundVariant,
} from "reactflow";
import "reactflow/dist/style.css";
import { getRoadmapByName, getTopicDetail, getSubtopicDetail, Topic, Subtopic } from "@/lib/roadmap-api";
import toast from "react-hot-toast";

// Custom Topic Node Component
function TopicNode({ data }: { data: any }) {
  const hasSubtopics = data.subtopicCount > 0;
  const isExpanded = data.isExpanded;
  
  return (
    <div className="relative">
      <button
        onClick={data.onToggle}
        className="relative bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-4 rounded-xl font-bold text-center shadow-lg transition-all hover:shadow-xl cursor-pointer border-2 border-yellow-600 min-w-[200px]"
      >
        <div className="text-xs text-yellow-800 mb-2 font-semibold">
          Topic {data.index}
        </div>
        <div className="text-sm">{data.label}</div>
        {data.tag && (
          <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full ${data.tagColor} border-2 border-white shadow-md`}></div>
        )}
        {hasSubtopics && (
          <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-blue-600 border-2 border-white shadow-md flex items-center justify-center">
            <span className="text-white text-xs font-bold">{isExpanded ? '−' : '+'}</span>
          </div>
        )}
      </button>
      {hasSubtopics && (
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap">
          {isExpanded ? 'Click to hide' : `${data.subtopicCount} subtopics`}
        </div>
      )}
    </div>
  );
}

// Custom Subtopic Node Component
function SubtopicNode({ data }: { data: any }) {
  return (
    <button
      onClick={data.onClick}
      className="relative bg-orange-300 hover:bg-orange-400 text-gray-900 px-4 py-2 rounded-lg font-semibold text-xs text-center shadow-md transition-all hover:shadow-lg cursor-pointer border-2 border-orange-500 min-w-[150px]"
    >
      <div>{data.label}</div>
      {data.tag && (
        <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${data.tagColor} border border-white shadow-sm`}></div>
      )}
    </button>
  );
}

  const nodeTypes = {
    topicNode: TopicNode,
    subtopicNode: SubtopicNode,
  };

  // Default layout configuration
  const defaultLayoutConfig = {
    nodeSpacingX: 350,
    nodeSpacingY: 200,
  };

  export default function RoadmapFlowPage() {
    const params = useParams();
    const router = useRouter();
    
    const roadmapName = decodeURIComponent(params.roadmapName as string);
    
  const [roadmapData, setRoadmapData] = useState<{ name: string; topics: Topic[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // React Flow states
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  // Track expanded topics (showing subtopics)
  const [expandedTopics, setExpandedTopics] = useState<Set<number>>(new Set());
  
  // Side panel for detail view
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [detailContent, setDetailContent] = useState<{ name: string; description: string; resources: string[] } | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);    // Load saved layout preferences from localStorage
    const loadSavedPreferences = useCallback(() => {
      try {
        const saved = localStorage.getItem('roadmap-flow-preferences');
        if (saved) {
          const parsed = JSON.parse(saved);
          return parsed;
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
      return defaultLayoutConfig;
    }, []);

    // Layout configuration with saved preferences
    const [layoutConfig, setLayoutConfig] = useState(loadSavedPreferences);

    // Save preferences to localStorage
    const savePreferences = useCallback(() => {
      setIsSaving(true);
      try {
        localStorage.setItem('roadmap-flow-preferences', JSON.stringify(layoutConfig));
        toast.success('Layout preferences saved!');
      } catch (error) {
        console.error('Error saving preferences:', error);
        toast.error('Failed to save preferences');
      } finally {
        setTimeout(() => setIsSaving(false), 500);
      }
    }, [layoutConfig]);

    // Reset to default preferences
    const resetPreferences = useCallback(() => {
      setLayoutConfig(defaultLayoutConfig);
      localStorage.removeItem('roadmap-flow-preferences');
      toast.success('Reset to default layout');
    }, []);

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

  // Toggle subtopics visibility
  const toggleTopicExpansion = useCallback((topicId: number) => {
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

  // Build nodes and edges based on layout configuration
  const { flowNodes, flowEdges } = useMemo(() => {
    if (!roadmapData) return { flowNodes: [], flowEdges: [] };

    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    const { nodeSpacingX, nodeSpacingY } = layoutConfig;

    // Horizontal layout - topics from left to right
    roadmapData.topics.forEach((topic, index) => {
      const x = index * nodeSpacingX;
      const isExpanded = expandedTopics.has(topic.id);

      // Add main topic node
      newNodes.push({
        id: `topic-${topic.id}`,
        type: 'topicNode',
        position: { x, y: 0 },
        data: {
          label: topic.name,
          index: index + 1,
          tag: topic.tags,
          tagColor: getTagColor(topic.tags || ""),
          subtopicCount: topic.subtopics.length,
          isExpanded: isExpanded,
          onToggle: () => toggleTopicExpansion(topic.id),
        },
      });

      // Connect to previous topic with smooth path
      if (index > 0) {
        const prevTopic = roadmapData.topics[index - 1];
        newEdges.push({
          id: `edge-${prevTopic.id}-${topic.id}`,
          source: `topic-${prevTopic.id}`,
          target: `topic-${topic.id}`,
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#3b82f6', strokeWidth: 3 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#3b82f6',
          },
        });
      }

      // Add subtopics only if expanded
      if (isExpanded && topic.subtopics.length > 0) {
        topic.subtopics.forEach((subtopic, subIndex) => {
          const subX = x + (subIndex - (topic.subtopics.length - 1) / 2) * 180;
          const subY = nodeSpacingY;

          newNodes.push({
            id: `subtopic-${subtopic.id}`,
            type: 'subtopicNode',
            position: { x: subX, y: subY },
            data: {
              label: subtopic.name,
              tag: subtopic.tags,
              tagColor: getTagColor(subtopic.tags || ""),
              onClick: () => handleSubtopicClick(subtopic.id, subtopic.name),
            },
          });

          // Connect subtopic to topic with dashed line
          newEdges.push({
            id: `edge-topic-${topic.id}-subtopic-${subtopic.id}`,
            source: `topic-${topic.id}`,
            target: `subtopic-${subtopic.id}`,
            type: 'straight',
            style: { stroke: '#fb923c', strokeWidth: 2, strokeDasharray: '5,5' },
          });
        });
      }
    });

    return { flowNodes: newNodes, flowEdges: newEdges };
  }, [roadmapData, layoutConfig, expandedTopics, handleSubtopicClick, toggleTopicExpansion]);

  useEffect(() => {
    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [flowNodes, flowEdges, setNodes, setEdges]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải roadmap...</p>
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
    <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'min-h-screen'} bg-gray-50 flex flex-col`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push("/candidate/road-map")}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Recommendations
            </button>
            <h1 className="text-2xl font-bold text-gray-900 capitalize">{roadmapData.name} (Flow View)</h1>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Spacing X:</label>
                <input
                  type="range"
                  min="250"
                  max="600"
                  value={layoutConfig.nodeSpacingX}
                  onChange={(e) => setLayoutConfig({ ...layoutConfig, nodeSpacingX: parseInt(e.target.value) })}
                  className="w-32"
                />
                <span className="text-xs text-gray-600 w-12">{layoutConfig.nodeSpacingX}px</span>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Spacing Y:</label>
                <input
                  type="range"
                  min="150"
                  max="350"
                  value={layoutConfig.nodeSpacingY}
                  onChange={(e) => setLayoutConfig({ ...layoutConfig, nodeSpacingY: parseInt(e.target.value) })}
                  className="w-32"
                />
                <span className="text-xs text-gray-600 w-12">{layoutConfig.nodeSpacingY}px</span>
              </div>
            </div>

            {/* Save and Reset buttons */}
            <div className="flex gap-3 items-center">
              <button
                onClick={savePreferences}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save'}
              </button>

              <button
                onClick={resetPreferences}
                className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>

          {/* Info text */}
          <div className="mt-2 text-xs text-gray-600">
            💡 Click on topics to expand/collapse subtopics. Drag to pan, scroll to zoom.
          </div>
        </div>
      </div>

      {/* React Flow Canvas */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
        >
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#e5e7eb" />
          <Controls />
          <MiniMap
            nodeColor={(node) => {
              if (node.type === 'topicNode') return '#fbbf24';
              if (node.type === 'subtopicNode') return '#fdba74';
              return '#e5e7eb';
            }}
            maskColor="rgba(0, 0, 0, 0.1)"
          />
        </ReactFlow>
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
