"use client";

import { useState } from "react";
import { Plus, Tag, Edit, Trash2 } from "lucide-react";

type TagType = {
    id: string;
    name: string;
    color: string;
    candidateCount: number;
    isAutomatic: boolean;
};

const mockTags: TagType[] = [
    { id: "1", name: "Need reminder", color: "bg-yellow-100 text-yellow-800", candidateCount: 0, isAutomatic: true },
    { id: "2", name: "Promising interview", color: "bg-green-100 text-green-800", candidateCount: 0, isAutomatic: true },
    { id: "3", name: "Potential fit", color: "bg-blue-100 text-blue-800", candidateCount: 0, isAutomatic: true },
];

export default function TagManagementPage() {
    const [tags, setTags] = useState<TagType[]>(mockTags);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newTagName, setNewTagName] = useState("");

    const handleAddTag = () => {
        if (newTagName.trim()) {
            const newTag: TagType = {
                id: Date.now().toString(),
                name: newTagName.trim(),
                color: "bg-purple-100 text-purple-800",
                candidateCount: 0,
                isAutomatic: false,
            };
            setTags([...tags, newTag]);
            setNewTagName("");
            setShowAddForm(false);
        }
    };

    return (
        <>
            <header className="mb-6 flex items-center justify-between">
                <h1 className="text-xl font-semibold text-sky-800">Tag management</h1>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="inline-flex h-9 items-center gap-2 rounded-md bg-sky-600 px-4 text-sm font-medium text-white hover:bg-sky-700"
                >
                    <Plus className="h-4 w-4" />
                    Add new tag
                </button>
            </header>

            {/* Categories */}
            <div className="space-y-6">
                {/* System tags */}
                <div className="rounded-lg bg-white p-6 shadow-sm shadow-sky-100">
                    <h2 className="mb-4 text-base font-semibold text-sky-900">System tags</h2>
                    <p className="mb-4 text-sm text-slate-600">
                        Automatic tags that help organize candidates based on their status and actions.
                    </p>
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {tags.filter(tag => tag.isAutomatic).map((tag) => (
                            <div key={tag.id} className="flex items-center justify-between rounded-md border p-3">
                                <div className="flex items-center gap-3">
                                    <Tag className="h-4 w-4 text-slate-400" />
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium">{tag.name}</span>
                                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${tag.color}`}>
                                                {tag.candidateCount} CV
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="text-xs text-slate-500">Automatic</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Custom tags */}
                <div className="rounded-lg bg-white p-6 shadow-sm shadow-sky-100">
                    <h2 className="mb-4 text-base font-semibold text-sky-900">Custom tags</h2>
                    <p className="mb-4 text-sm text-slate-600">
                        Create your own tags to organize candidates according to your specific needs.
                    </p>

                    {showAddForm && (
                        <div className="mb-4 rounded-md border border-sky-200 bg-sky-50 p-4">
                            <div className="flex items-center gap-3">
                                <input
                                    type="text"
                                    value={newTagName}
                                    onChange={(e) => setNewTagName(e.target.value)}
                                    placeholder="Enter tag name"
                                    className="flex-1 rounded-md border bg-white px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                                />
                                <button
                                    onClick={handleAddTag}
                                    className="inline-flex h-9 items-center rounded-md bg-sky-600 px-4 text-sm font-medium text-white hover:bg-sky-700"
                                >
                                    Add
                                </button>
                                <button
                                    onClick={() => setShowAddForm(false)}
                                    className="inline-flex h-9 items-center rounded-md border px-4 text-sm font-medium text-sky-800 hover:bg-sky-50"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {tags.filter(tag => !tag.isAutomatic).map((tag) => (
                            <div key={tag.id} className="flex items-center justify-between rounded-md border p-3">
                                <div className="flex items-center gap-3">
                                    <Tag className="h-4 w-4 text-slate-400" />
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium">{tag.name}</span>
                                            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${tag.color}`}>
                                                {tag.candidateCount} CV
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button className="p-1 text-slate-400 hover:text-sky-600">
                                        <Edit className="h-4 w-4" />
                                    </button>
                                    <button className="p-1 text-slate-400 hover:text-red-600">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {tags.filter(tag => !tag.isAutomatic).length === 0 && (
                            <div className="col-span-full text-center py-8">
                                <Tag className="mx-auto mb-3 h-12 w-12 text-slate-300" />
                                <p className="text-sm text-slate-500">No custom tags yet. Create your first tag to get started.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}