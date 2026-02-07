"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ArrowUp, Paperclip, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Attachment } from "@/lib/types/chat";
import { AttachmentThumbnail } from "./AttachmentThumbnail";

interface ChatInputProps {
  input: string;
  onInputChange: (value: string) => void;
  attachments: Attachment[];
  onRemoveAttachment: (id: string) => void;
  onAttachmentClick: (attachment: Attachment) => void;
  onFilesSelected: (files: File[]) => void;
  onSubmit: () => void;
  isStreaming: boolean;
  uploadError: string | null;
}

export function ChatInput({
  input,
  onInputChange,
  attachments,
  onRemoveAttachment,
  onAttachmentClick,
  onFilesSelected,
  onSubmit,
  isStreaming,
  uploadError,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    onFilesSelected(files);
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    onFilesSelected(files);
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onSubmit();
      }
    },
    [onSubmit]
  );

  return (
    <div
      className={`relative flex flex-col rounded-2xl border bg-white shadow-sm transition-colors focus-within:border-stone-300 focus-within:ring-2 focus-within:ring-stone-200 ${
        isDragOver ? "border-blue-400 bg-blue-50" : "border-stone-200"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Attachment previews */}
      <AnimatePresence>
        {attachments.length > 0 && (
          <motion.div
            key="attachments-container"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <motion.div layout className="flex flex-wrap gap-3 px-3 pt-3">
              <AnimatePresence>
                {attachments.map((attachment) => (
                  <motion.div
                    key={attachment.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15, ease: "easeInOut" }}
                    className="group relative"
                  >
                    <button
                      type="button"
                      onClick={() => onAttachmentClick(attachment)}
                      className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg bg-stone-100 transition-opacity hover:opacity-80"
                    >
                      <AttachmentThumbnail attachment={attachment} size="sm" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveAttachment(attachment.id);
                      }}
                      className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-stone-800 text-white opacity-0 shadow-sm transition-opacity hover:bg-stone-700 group-hover:opacity-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error message */}
      {uploadError && (
        <div className="px-3 pt-2">
          <p className="text-sm text-red-500">{uploadError}</p>
        </div>
      )}

      {/* Input row */}
      <div className="flex items-end">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/gif,image/webp,application/pdf"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isStreaming}
          className="m-2 flex h-9 w-9 items-center justify-center rounded-lg text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-600 disabled:opacity-50"
          title="Attach files"
        >
          <Paperclip className="h-5 w-5" />
        </button>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isDragOver ? "Drop files here..." : "Message..."}
          rows={1}
          disabled={isStreaming}
          className="max-h-[200px] min-h-[52px] flex-1 resize-none bg-transparent py-3.5 pr-2 text-text placeholder:text-stone-400 focus:outline-none disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={(!input.trim() && attachments.length === 0) || isStreaming}
          className="m-2 flex h-9 w-9 items-center justify-center rounded-xl bg-heading text-white transition-colors hover:bg-opacity-90 disabled:bg-stone-300 disabled:text-stone-400"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      </div>

      {/* Drag overlay */}
      {isDragOver && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-2xl bg-blue-50/80">
          <p className="font-medium text-blue-600">Drop files to attach</p>
        </div>
      )}
    </div>
  );
}
