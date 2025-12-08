'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Button } from '@/components/ui/button';
import {
    Bold,
    Italic,
    Strikethrough,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo
} from 'lucide-react';
import { useEffect, useState } from 'react';


type TipTapEditorProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
};

export default function TipTapEditor({
    value,
    onChange,
    placeholder,
    className = ''
}: TipTapEditorProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4',
                'data-placeholder': placeholder || 'Start writing...',
            },
        },
        immediatelyRender: false,
    });

    if (!isMounted || !editor) {
        return (
            <div className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}>
                <div className="flex items-center gap-1 p-2 border-b border-gray-300 bg-gray-50">
                    <div className="text-xs text-gray-500">Loading editor...</div>
                </div>
                <div className="min-h-[200px] p-4 bg-gray-50 flex items-center justify-center">
                    <div className="text-gray-500">Loading rich text editor...</div>
                </div>
            </div>
        );
    }

    return (
        <div className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}>
            <style dangerouslySetInnerHTML={{
                __html: `
                    .ProseMirror {
                        outline: none;
                        padding: 1rem;
                        min-height: 280px;
                        height: 100%;
                    }
                    .ProseMirror h1 {
                        font-size: 2em;
                        font-weight: bold;
                        margin: 0.67em 0;
                        line-height: 1.2;
                    }
                    .ProseMirror h2 {
                        font-size: 1.5em;
                        font-weight: bold;
                        margin: 0.75em 0;
                        line-height: 1.3;
                    }
                    .ProseMirror h3 {
                        font-size: 1.17em;
                        font-weight: bold;
                        margin: 0.83em 0;
                        line-height: 1.4;
                    }
                    .ProseMirror ul, .ProseMirror ol {
                        margin: 1em 0;
                        padding-left: 2em;
                    }
                    .ProseMirror li {
                        margin: 0.5em 0;
                    }
                    .ProseMirror blockquote {
                        margin: 1em 0;
                        padding-left: 1em;
                        border-left: 3px solid #ccc;
                        font-style: italic;
                    }
                    .ProseMirror strong {
                        font-weight: bold;
                    }
                    .ProseMirror em {
                        font-style: italic;
                    }
                    .ProseMirror s {
                        text-decoration: line-through;
                    }
                    .ProseMirror p {
                        margin: 0.5em 0;
                    }
                    .ProseMirror p.is-editor-empty:first-child::before {
                        content: attr(data-placeholder);
                        float: left;
                        color: #adb5bd;
                        pointer-events: none;
                        height: 0;
                    }
                `
            }} />
            {/* Toolbar */}
            <div className="flex items-center gap-1 p-2 border-b border-gray-300 bg-gray-50">
                {/* Headings */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`h-8 px-2 text-sm font-bold ${editor.isActive('heading', { level: 1 }) ? 'bg-blue-100 text-blue-800' : ''
                        }`}
                >
                    H1
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`h-8 px-2 text-sm font-bold ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-100 text-blue-800' : ''
                        }`}
                >
                    H2
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={`h-8 px-2 text-sm font-bold ${editor.isActive('heading', { level: 3 }) ? 'bg-blue-100 text-blue-800' : ''
                        }`}
                >
                    H3
                </Button>

                <div className="w-px h-6 bg-gray-300 mx-1" />

                {/* Text Formatting */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`h-8 w-8 p-0 ${editor.isActive('bold') ? 'bg-blue-100 text-blue-800' : ''
                        }`}
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`h-8 w-8 p-0 ${editor.isActive('italic') ? 'bg-blue-100 text-blue-800' : ''
                        }`}
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={`h-8 w-8 p-0 ${editor.isActive('strike') ? 'bg-blue-100 text-blue-800' : ''
                        }`}
                >
                    <Strikethrough className="h-4 w-4" />
                </Button>

                <div className="w-px h-6 bg-gray-300 mx-1" />

                {/* Lists */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`h-8 w-8 p-0 ${editor.isActive('bulletList') ? 'bg-blue-100 text-blue-800' : ''
                        }`}
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`h-8 w-8 p-0 ${editor.isActive('orderedList') ? 'bg-blue-100 text-blue-800' : ''
                        }`}
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`h-8 w-8 p-0 ${editor.isActive('blockquote') ? 'bg-blue-100 text-blue-800' : ''
                        }`}
                >
                    <Quote className="h-4 w-4" />
                </Button>

                <div className="w-px h-6 bg-gray-300 mx-1" />

                {/* Undo/Redo */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    className="h-8 w-8 p-0"
                >
                    <Undo className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    className="h-8 w-8 p-0"
                >
                    <Redo className="h-4 w-4" />
                </Button>

                <div className="flex-1" />
                <div className="text-xs text-gray-500">Rich Text Editor</div>
            </div>

            {/* Editor Content Area */}
            <div className="min-h-[300px] bg-white">
                <EditorContent editor={editor} />
            </div>

            {/* Footer - Fixed at bottom */}
            <div className="p-2 bg-gray-50 border-t border-gray-300 text-xs text-gray-500">
                <strong>Tips:</strong> Select text and use the toolbar to format it. All formatting works properly!
            </div>
        </div>
    );
}
