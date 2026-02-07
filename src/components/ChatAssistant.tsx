"use client";

import { useState, useCallback, useRef, useEffect } from "react";
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
import {
  AttachmentPreviewModal,
  ChatInput,
  ChatMessage,
} from "./chat";

export function ChatAssistant() {
  const { messages, isStreaming, sendMessage } = useChat();
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewAttachment, setPreviewAttachment] = useState<Attachment | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (isStreaming) return;

      const currentInput = input;
      const currentAttachments = [...attachments];

      // Clear immediately for snappy UX
      setInput("");
      setAttachments([]);

      const success = await sendMessage(currentInput, currentAttachments);

      // Restore on failure
      if (!success) {
        setInput(currentInput);
        setAttachments(currentAttachments);
      }
    },
    [input, isStreaming, attachments, sendMessage]
  );

  const hasMessages = messages.length > 0;

  // Initial centered layout (like Claude)
  if (!hasMessages) {
    return (
      <>
        {previewAttachment && (
          <AttachmentPreviewModal
            attachment={previewAttachment}
            onClose={() => setPreviewAttachment(null)}
          />
        )}
        <div className="flex h-full flex-col items-center justify-center px-4">
          <div className="w-full max-w-2xl">
            <h1 className="mb-8 text-center font-serif text-4xl text-heading">
              How can I help you today?
            </h1>
            <form onSubmit={handleSubmit}>
              <ChatInput
                input={input}
                onInputChange={setInput}
                attachments={attachments}
                onRemoveAttachment={removeAttachment}
                onAttachmentClick={setPreviewAttachment}
                onFilesSelected={handleFiles}
                onSubmit={() => handleSubmit()}
                isStreaming={isStreaming}
                uploadError={uploadError}
              />
            </form>
            <p className="mt-3 text-center text-sm text-stone-400">
              AI can make mistakes. Please verify important information.
            </p>
          </div>
        </div>
      </>
    );
  }

  // Conversation layout (messages + input at bottom)
  return (
    <>
      {previewAttachment && (
        <AttachmentPreviewModal
          attachment={previewAttachment}
          onClose={() => setPreviewAttachment(null)}
        />
      )}
      <div className="relative h-full">
        {/* Messages area - scrollable with bottom padding for input */}
        <div className="h-full overflow-y-auto px-4 py-6 pb-24">
          <div className="mx-auto max-w-4xl space-y-6 px-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                id={message.id}
                role={message.role}
                content={message.content}
                attachments={message.attachments}
                isStreaming={isStreaming && messages[messages.length - 1]?.id === message.id}
                onAttachmentClick={setPreviewAttachment}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input area - floating at bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-bg px-4 pb-4">
          <form onSubmit={handleSubmit} className="mx-auto max-w-4xl">
            <ChatInput
              input={input}
              onInputChange={setInput}
              attachments={attachments}
              onRemoveAttachment={removeAttachment}
              onAttachmentClick={setPreviewAttachment}
              onFilesSelected={handleFiles}
              onSubmit={() => handleSubmit()}
              isStreaming={isStreaming}
              uploadError={uploadError}
            />
          </form>
        </div>
      </div>
    </>
  );
}
