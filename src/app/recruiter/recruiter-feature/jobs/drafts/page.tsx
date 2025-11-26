"use client";

import React, { useState } from "react";
import { Pencil, Trash2, CheckCircle, X } from "lucide-react";

interface DraftJob {
  id: number;
  title: string;
  date: string;
  status: string;
  progress: string;
}

const initialDrafts: DraftJob[] = [
  {
    id: 1,
    title: "Senior Software Engineer (Backend)",
    date: "2025-10-10",
    status: "Incomplete",
    progress: "60%",
  },
  {
    id: 2,
    title: "Digital Marketing Specialist (HCM)",
    date: "2025-10-08",
    status: "Pending Review",
    progress: "90%",
  },
  {
    id: 3,
    title: "UI/UX Design Intern",
    date: "2025-10-05",
    status: "Incomplete",
    progress: "45%",
  },
];

export default function DraftJobsPage() {
  const [drafts, setDrafts] = useState(initialDrafts);
  const [selectedDraft, setSelectedDraft] = useState<DraftJob | null>(null);
  const [modalType, setModalType] = useState<"edit" | "publish" | "delete" | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const openModal = (draft: DraftJob, type: "edit" | "publish" | "delete") => {
    setSelectedDraft(draft);
    setModalType(type);
    setEditTitle(draft.title);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedDraft(null);
  };

  // Save edited title
  const handleSaveEdit = () => {
    if (!selectedDraft) return;
    setDrafts((prev) =>
      prev.map((d) => (d.id === selectedDraft.id ? { ...d, title: editTitle } : d))
    );
    closeModal();
  };

  // Publish draft (mock behavior)
  const handlePublish = () => {
    if (!selectedDraft) return;
    alert(`Job "${selectedDraft.title}" has been published!`);
    setDrafts((prev) => prev.filter((d) => d.id !== selectedDraft.id));
    closeModal();
  };

  // Delete draft
  const handleDelete = () => {
    if (!selectedDraft) return;
    setDrafts((prev) => prev.filter((d) => d.id !== selectedDraft.id));
    closeModal();
  };

  return (
    <div className="p-4 sm:p-0">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Draft Job Posts</h1>
        <span className="text-sm text-gray-500">Manage unfinished job postings</span>
      </header>

      {/* Search + New Draft */}
      <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <input
          type="text"
          placeholder="Search by job title..."
          className="flex-grow w-full md:w-auto p-2 border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500 transition duration-150"
        />

        <button
          onClick={() => alert("Open Create Job form")}
          className="w-full md:w-auto px-4 py-2 bg-sky-600 text-white font-semibold rounded-md shadow-md hover:bg-sky-700 transition duration-300 flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-5 h-5" /> Create New Job Post
        </button>
      </div>

      {/* Draft List */}
      <div className="rounded-lg border bg-white shadow-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Job Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">
                Created Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status & Progress
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {drafts.map((job) => (
              <tr key={job.id} className="hover:bg-gray-50 transition duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {job.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                  {job.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="text-gray-600 font-medium block mb-1">
                    {job.status}
                  </span>
                  <div className="w-24 bg-gray-200 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full bg-amber-400"
                      style={{ width: job.progress }}
                      title={`Progress: ${job.progress}`}
                    ></div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => openModal(job, "edit")}
                    className="text-sky-600 hover:text-sky-900 transition duration-150 mr-3"
                    title="Edit draft"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => openModal(job, "publish")}
                    className="text-green-600 hover:text-green-800 transition duration-150 mr-3"
                    title="Publish job"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => openModal(job, "delete")}
                    className="text-red-600 hover:text-red-800 transition duration-150"
                    title="Delete draft"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {drafts.length === 0 && (
        <div className="mt-8 p-10 text-center bg-white rounded-lg border border-dashed border-gray-300 shadow-inner">
          <div className="text-5xl text-gray-400 mx-auto mb-4">📂</div>
          <p className="text-lg text-gray-600 font-medium">
            You have no draft job posts yet.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Click "Create New Job Post" to start.
          </p>
        </div>
      )}

      {/* Lightweight Modal */}
      {modalType && selectedDraft && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white border border-gray-300 shadow-xl rounded-lg p-6 w-80 pointer-events-auto relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            {modalType === "edit" && (
              <>
                <h2 className="text-lg font-semibold mb-4 text-gray-800">
                  Edit Draft Title
                </h2>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:ring-sky-500 focus:border-sky-500"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={closeModal}
                    className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="px-3 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700"
                  >
                    Save
                  </button>
                </div>
              </>
            )}

            {modalType === "publish" && (
              <>
                <h2 className="text-lg font-semibold mb-4 text-gray-800">
                  Publish Job Post
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Are you sure you want to publish{" "}
                  <strong>{selectedDraft.title}</strong>?
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={closeModal}
                    className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePublish}
                    className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Confirm
                  </button>
                </div>
              </>
            )}

            {modalType === "delete" && (
              <>
                <h2 className="text-lg font-semibold mb-4 text-gray-800">
                  Delete Draft
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  This action cannot be undone. Delete{" "}
                  <strong>{selectedDraft.title}</strong>?
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={closeModal}
                    className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
