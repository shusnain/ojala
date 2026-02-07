// Attachment stored on the client side
export interface Attachment {
  id: string;
  type: "image" | "pdf";
  name: string;
  mimeType: string;
  data: string; // Base64 encoded
  preview?: string; // Base64 thumbnail/preview
}

// OpenAI content parts for multimodal messages
export interface TextContent {
  type: "text";
  text: string;
}

export interface ImageContent {
  type: "image_url";
  image_url: {
    url: string;
    detail?: "auto" | "low" | "high";
  };
}

export type ContentPart = TextContent | ImageContent;

// Message format for API requests
export interface ChatMessage {
  role: "user" | "assistant";
  content: string | ContentPart[];
}

export interface ChatRequest {
  messages: ChatMessage[];
}

// Extended message for UI display
export interface UIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  attachments?: Attachment[];
}

// File constraints
export const MAX_IMAGE_SIZE = 20 * 1024 * 1024; // 20MB
export const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_ATTACHMENTS = 10;
export const SUPPORTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/gif", "image/webp"];
export const SUPPORTED_PDF_TYPES = ["application/pdf"];
