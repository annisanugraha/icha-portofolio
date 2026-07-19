'use client';

import React, { useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { supabase } from '@/lib/supabase';
import { 
  Bold, 
  Italic, 
  Heading2, 
  Heading3, 
  Quote, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Unlink,
  Minus, 
  Undo, 
  Redo, 
  Upload
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  placeholder = 'Write the narrative story of this project... Use bold, italics, headings, quotes, links, and insert images right inline!'
}) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      ImageExtension.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-md border border-[#ebebeb] my-6 w-full object-cover max-h-[500px]',
        },
      }),
      LinkExtension.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
        HTMLAttributes: {
          class: 'text-[#111] underline font-medium decoration-[#aaa] hover:decoration-[#111] transition-colors cursor-pointer',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[250px] p-4 text-[#111] leading-relaxed',
      },
    },
  });

  if (!editor) {
    return <div className="border border-[#ebebeb] p-6 bg-[#fafafa] text-[#999] text-xs">Loading editor...</div>;
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `project-content/${fileName}`;

      // Try uploading to 'portfolio' bucket first, which is standard across our admin tools
      let { error, data } = await supabase.storage.from('portfolio').upload(filePath, file);
      let bucketName = 'portfolio';

      // If 'portfolio' fails (e.g. bucket not found), try 'project-content' bucket
      if (error && error.message.toLowerCase().includes('bucket not found')) {
        const fallback = await supabase.storage.from('project-content').upload(filePath, file);
        error = fallback.error;
        data = fallback.data;
        bucketName = 'project-content';
      }

      if (error) {
        throw error;
      }

      const { data: publicData } = supabase.storage.from(bucketName).getPublicUrl(filePath);
      if (publicData?.publicUrl) {
        editor.chain().focus().setImage({ src: publicData.publicUrl }).run();
      }
    } catch (err: any) {
      console.error('Image upload error inside TipTap:', err);
      alert('Failed to upload image: ' + (err.message || 'Unknown error'));
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const addImageUrl = () => {
    const url = window.prompt('Enter Image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL:', previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="border border-[#ebebeb] bg-white overflow-hidden">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-[#fafafa] border-b border-[#ebebeb]">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded transition-colors ${
            editor.isActive('bold') ? 'bg-[#111] text-white' : 'text-[#666] hover:bg-[#eaeaea] hover:text-[#111]'
          }`}
          title="Bold"
        >
          <Bold size={14} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded transition-colors ${
            editor.isActive('italic') ? 'bg-[#111] text-white' : 'text-[#666] hover:bg-[#eaeaea] hover:text-[#111]'
          }`}
          title="Italic"
        >
          <Italic size={14} />
        </button>

        <span className="w-[1px] h-4 bg-[#e0e0e0] mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded transition-colors ${
            editor.isActive('heading', { level: 2 }) ? 'bg-[#111] text-white' : 'text-[#666] hover:bg-[#eaeaea] hover:text-[#111]'
          }`}
          title="Heading 2"
        >
          <Heading2 size={14} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1.5 rounded transition-colors ${
            editor.isActive('heading', { level: 3 }) ? 'bg-[#111] text-white' : 'text-[#666] hover:bg-[#eaeaea] hover:text-[#111]'
          }`}
          title="Heading 3"
        >
          <Heading3 size={14} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded transition-colors ${
            editor.isActive('blockquote') ? 'bg-[#111] text-white' : 'text-[#666] hover:bg-[#eaeaea] hover:text-[#111]'
          }`}
          title="Blockquote"
        >
          <Quote size={14} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="p-1.5 rounded text-[#666] hover:bg-[#eaeaea] hover:text-[#111] transition-colors"
          title="Horizontal Rule"
        >
          <Minus size={14} />
        </button>

        <span className="w-[1px] h-4 bg-[#e0e0e0] mx-1" />

        <button
          type="button"
          onClick={setLink}
          className={`p-1.5 rounded transition-colors ${
            editor.isActive('link') ? 'bg-[#111] text-white' : 'text-[#666] hover:bg-[#eaeaea] hover:text-[#111]'
          }`}
          title="Add / Edit Link"
        >
          <LinkIcon size={14} />
        </button>

        {editor.isActive('link') && (
          <button
            type="button"
            onClick={() => editor.chain().focus().unsetLink().run()}
            className="p-1.5 rounded text-[#666] hover:bg-[#eaeaea] hover:text-[#111] transition-colors"
            title="Remove Link"
          >
            <Unlink size={14} />
          </button>
        )}

        <span className="w-[1px] h-4 bg-[#e0e0e0] mx-1" />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1 px-2 py-1 rounded text-xs font-mono bg-white border border-[#ebebeb] text-[#333] hover:border-[#111] hover:text-[#111] transition-all cursor-pointer disabled:opacity-50"
          title="Upload Image File"
        >
          <Upload size={12} />
          <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
        </button>

        <button
          type="button"
          onClick={addImageUrl}
          className="flex items-center gap-1 px-2 py-1 rounded text-xs font-mono bg-white border border-[#ebebeb] text-[#333] hover:border-[#111] hover:text-[#111] transition-all cursor-pointer"
          title="Insert Image by URL"
        >
          <ImageIcon size={12} />
          <span>Image URL</span>
        </button>

        <div className="flex-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 rounded text-[#666] hover:bg-[#eaeaea] hover:text-[#111] transition-colors disabled:opacity-30"
          title="Undo"
        >
          <Undo size={14} />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 rounded text-[#666] hover:bg-[#eaeaea] hover:text-[#111] transition-colors disabled:opacity-30"
          title="Redo"
        >
          <Redo size={14} />
        </button>
      </div>

      {/* Editor Content Area */}
      <div className="min-h-[250px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};
