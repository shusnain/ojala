"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { ArrowUp, Paperclip, X, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Streamdown } from "streamdown";
import { code } from "@streamdown/code";
import type { Attachment } from "@/lib/types/chat";
import {
  getFileType,
  validateFile,
  validateAttachmentCount,
  createImageAttachment,
  createPDFAttachment,
} from "@/lib/files";
import { getPDFPreview } from "@/lib/pdf";
import { useChat } from "@/hooks/useChat";

export function ChatAssistant() {
  const { messages, isStreaming, sendMessage } = useChat();
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewAttachment, setPreviewAttachment] = useState<Attachment | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [input]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (uploadError) {
      const timer = setTimeout(() => setUploadError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [uploadError]);

  const handleFiles = useCallback(async (files: File[]) => {
    const countValidation = validateAttachmentCount(attachments.length, files.length);
    if (!countValidation.valid) {
      setUploadError(countValidation.error!);
      return;
    }

    const newAttachments: Attachment[] = [];

    for (const file of files) {
      const validation = validateFile(file);
      if (!validation.valid) {
        setUploadError(validation.error!);
        continue;
      }

      const fileType = getFileType(file);

      try {
        if (fileType === "image") {
          const attachment = await createImageAttachment(file);
          newAttachments.push(attachment);
        } else if (fileType === "pdf") {
          const preview = await getPDFPreview(file);
          const attachment = await createPDFAttachment(file, preview);
          newAttachments.push(attachment);
        }
      } catch (error) {
        console.error("Failed to process file:", error);
        setUploadError(`Failed to process ${file.name}`);
      }
    }

    setAttachments((prev) => [...prev, ...newAttachments]);
  }, [attachments.length]);

  // Handle paste for images
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      const files: File[] = [];
      for (const item of items) {
        if (item.kind === "file") {
          const file = item.getAsFile();
          if (file) files.push(file);
        }
      }

      if (files.length > 0) {
        e.preventDefault();
        await handleFiles(files);
      }
    };

    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [handleFiles]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    await handleFiles(files);
    e.target.value = "";
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
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
    await handleFiles(files);
  };

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (isStreaming) return;

      await sendMessage(input, attachments);
      setInput("");
      setAttachments([]);
    },
    [input, isStreaming, attachments, sendMessage]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit]
  );

  const hasMessages = messages.length > 0;

  // Preview modal component
  const PreviewModal = () => {
    if (!previewAttachment) return null;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
        onClick={() => setPreviewAttachment(null)}
      >
        <button
          onClick={() => setPreviewAttachment(null)}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        >
          <X className="h-6 w-6" />
        </button>
        <div
          className="max-h-[90vh] max-w-[90vw] overflow-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {previewAttachment.type === "image" ? (
            <img
              src={previewAttachment.data}
              alt={previewAttachment.name}
              className="max-h-[85vh] rounded-lg object-contain"
            />
          ) : previewAttachment.preview ? (
            <img
              src={previewAttachment.preview}
              alt={previewAttachment.name}
              className="max-h-[85vh] rounded-lg object-contain"
            />
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg bg-white p-12">
              <FileText className="h-16 w-16 text-stone-400" />
              <p className="mt-4 text-lg font-medium text-stone-700">{previewAttachment.name}</p>
              <p className="mt-1 text-sm text-stone-500">PDF document</p>
            </div>
          )}
          <p className="mt-2 text-center text-sm text-white/70">{previewAttachment.name}</p>
        </div>
      </div>
    );
  };

  const inputArea = (
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
            transition={{ duration: 0.2, ease: "easeOut" }}
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
                    transition={{ duration: 0.15 }}
                    className="group relative"
                  >
                    <button
                      type="button"
                      onClick={() => setPreviewAttachment(attachment)}
                      className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg bg-stone-100 transition-opacity hover:opacity-80"
                    >
                      {attachment.type === "image" ? (
                        <img
                          src={attachment.preview || attachment.data}
                          alt={attachment.name}
                          className="h-full w-full object-cover"
                        />
                      ) : attachment.preview ? (
                        <img
                          src={attachment.preview}
                          alt={attachment.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center p-1">
                          <FileText className="h-6 w-6 text-stone-500" />
                          <span className="mt-0.5 max-w-full truncate text-[10px] text-stone-500">
                            PDF
                          </span>
                        </div>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeAttachment(attachment.id);
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
          onChange={(e) => setInput(e.target.value)}
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

  // Initial centered layout (like Claude)
  if (!hasMessages) {
    return (
      <>
        <PreviewModal />
        <div className="flex h-full flex-col items-center justify-center px-4">
          <div className="w-full max-w-2xl">
            <h1 className="mb-8 text-center font-serif text-4xl text-heading">
              How can I help you today?
            </h1>
            <form onSubmit={handleSubmit}>
              {inputArea}
            </form>
            <p className="mt-3 text-center text-sm text-stone-400">
              Attach images or PDFs to include them in your message
            </p>
          </div>
        </div>
      </>
    );
  }

  // Conversation layout (messages + input at bottom)
  return (
    <>
      <PreviewModal />
      <div className="flex h-full flex-col">
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="mx-auto max-w-3xl space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-heading text-white"
                      : "bg-white text-text shadow-sm"
                  }`}
                >
                  {/* Attachment display for user messages */}
                  {message.role === "user" && message.attachments && message.attachments.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-2">
                      {message.attachments.map((attachment) => (
                        <button
                          key={attachment.id}
                          onClick={() => setPreviewAttachment(attachment)}
                          className="h-20 w-20 overflow-hidden rounded-lg transition-opacity hover:opacity-80"
                        >
                          {attachment.type === "image" ? (
                            <img
                              src={attachment.preview || attachment.data}
                              alt={attachment.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full flex-col items-center justify-center bg-white/10">
                              <FileText className="h-8 w-8" />
                              <span className="mt-1 max-w-full truncate px-1 text-[10px]">
                                {attachment.name}
                              </span>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                  {message.role === "assistant" ? (
                    <Streamdown
                      plugins={{ code }}
                      isAnimating={isStreaming && messages[messages.length - 1]?.id === message.id}
                    >
                      {message.content || " "}
                    </Streamdown>
                  ) : (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input area at bottom */}
        <div className="border-t border-stone-200 bg-white px-4 py-4">
          <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
            {inputArea}
          </form>
        </div>
      </div>
    </>
  );
}
