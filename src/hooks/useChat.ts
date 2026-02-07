"use client";

import { useState, useCallback } from "react";
import type { UIMessage, ContentPart, Attachment } from "@/lib/types/chat";
import { convertPDFToImages } from "@/lib/pdf";

interface UseChatReturn {
  messages: UIMessage[];
  isStreaming: boolean;
  sendMessage: (text: string, attachments: Attachment[]) => Promise<void>;
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const sendMessage = useCallback(
    async (text: string, attachments: Attachment[]) => {
      const trimmedInput = text.trim();
      if ((!trimmedInput && attachments.length === 0) || isStreaming) return;

      // Build content parts for the API
      const contentParts: ContentPart[] = [];

      // Add text if present
      if (trimmedInput) {
        contentParts.push({ type: "text", text: trimmedInput });
      }

      // Add attachments
      for (const attachment of attachments) {
        if (attachment.type === "image") {
          contentParts.push({
            type: "image_url",
            image_url: { url: attachment.data, detail: "auto" },
          });
        } else if (attachment.type === "pdf") {
          // Convert PDF pages to images
          try {
            const response = await fetch(attachment.data);
            const blob = await response.blob();
            const file = new File([blob], attachment.name, { type: attachment.mimeType });
            const pages = await convertPDFToImages(file);

            contentParts.push({
              type: "text",
              text: `[PDF: ${attachment.name}, ${pages.length} page(s)]`,
            });

            for (const page of pages) {
              contentParts.push({
                type: "image_url",
                image_url: { url: page.dataUrl, detail: "auto" },
              });
            }
          } catch (error) {
            console.error("Failed to convert PDF:", error);
            contentParts.push({
              type: "text",
              text: `[Failed to process PDF: ${attachment.name}]`,
            });
          }
        }
      }

      const userMessage: UIMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: trimmedInput,
        attachments: [...attachments],
      };

      const assistantMessage: UIMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
      };

      const newMessages = [...messages, userMessage];
      setMessages([...newMessages, assistantMessage]);
      setIsStreaming(true);

      try {
        // Build API messages
        const apiMessages = newMessages.map((msg) => {
          if (msg.id === userMessage.id) {
            return { role: msg.role, content: contentParts };
          }
          if (msg.attachments && msg.attachments.length > 0) {
            const parts: ContentPart[] = [];
            if (msg.content) {
              parts.push({ type: "text" as const, text: msg.content });
            }
            for (const att of msg.attachments) {
              if (att.type === "image") {
                parts.push({
                  type: "image_url" as const,
                  image_url: { url: att.data, detail: "auto" as const },
                });
              }
            }
            return { role: msg.role, content: parts };
          }
          return { role: msg.role, content: msg.content };
        });

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: apiMessages }),
        });

        if (!response.ok) {
          throw new Error("Failed to send message");
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response body");

        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  setMessages((prev) => {
                    const updated = [...prev];
                    const lastMsg = updated[updated.length - 1];
                    if (lastMsg && lastMsg.role === "assistant") {
                      updated[updated.length - 1] = {
                        ...lastMsg,
                        content: lastMsg.content + parsed.content,
                      };
                    }
                    return updated;
                  });
                }
              } catch {
                // Skip malformed JSON
              }
            }
          }
        }
      } catch (error) {
        console.error("Chat error:", error);
        setMessages((prev) => {
          const updated = [...prev];
          const lastMsg = updated[updated.length - 1];
          if (lastMsg && lastMsg.role === "assistant") {
            updated[updated.length - 1] = {
              ...lastMsg,
              content: "Sorry, something went wrong. Please try again.",
            };
          }
          return updated;
        });
      } finally {
        setIsStreaming(false);
      }
    },
    [isStreaming, messages]
  );

  return { messages, isStreaming, sendMessage };
}
