# Findings & Decisions

## Requirements
- Add ability to attach documents and images to chat messages
- Send attachments to LLM (OpenAI) for multimodal understanding
- **Image formats**: PNG, JPG, GIF, WebP
- **Document formats**: PDF (convert pages to images for OpenAI)
- **Upload methods**: Click file picker + drag-and-drop + clipboard paste (Ctrl+V)
- **Multiple attachments**: Yes, up to 5-10 per message
- Display attachment previews in chat interface

## Research Findings

### Current Implementation
- **ChatAssistant.tsx**: Main chat component at `src/components/ChatAssistant.tsx`
  - Uses simple text-only messages: `{ id, role, content }`
  - No file upload capability currently
  - Uses `textarea` for input with send button
  - Streaming responses via SSE
  - Streamdown for markdown rendering

- **API Route**: `src/app/api/chat/route.ts`
  - POST endpoint accepting `ChatRequest`
  - Uses OpenAI SDK with streaming
  - Current model: `gpt-4o-mini`
  - Simple text messages only

- **Types**: `src/lib/types/chat.ts`
  - `ChatMessage { role, content }`
  - `ChatRequest { messages }`

### OpenAI Vision API Format
OpenAI supports multimodal content via structured message format:
```typescript
{
  role: "user",
  content: [
    { type: "text", text: "What's in this image?" },
    {
      type: "image_url",
      image_url: {
        url: "data:image/jpeg;base64,{base64_data}",
        detail: "auto" // or "low" or "high"
      }
    }
  ]
}
```

### Supported Image Formats (OpenAI)
- PNG (.png)
- JPEG (.jpg, .jpeg)
- GIF (.gif) - non-animated
- WebP (.webp)

### Image Size Limits (OpenAI)
- Maximum file size: 20MB per image
- For "high" detail: max 2048x2048 pixels
- For "low" detail: scaled to 512x512

### PDF Handling
- OpenAI does NOT natively support PDF files in vision API
- Options:
  1. Convert PDF pages to images and send as images
  2. Extract text from PDF and send as text
  3. Use a separate PDF processing service
- Recommendation: Start with images only, add PDF support later

## Technical Decisions
| Decision | Rationale |
|----------|-----------|
| Use base64 for images | Avoids file storage complexity, OpenAI accepts data URLs |
| Client-side base64 conversion | Reduces server load, immediate preview |
| Use gpt-4o-mini | Already configured, supports vision |
| Multiple attachments per message | Common use case, flexible |
| Drag-and-drop + click upload | Best UX practice |
| Support images + PDFs | User requirement - PDFs will be converted to images |
| Click + drag + paste | Full upload experience as requested |
| Multiple attachments (up to 10) | User requirement for flexibility |

## Planned Architecture

### Attachment Type Structure
```typescript
interface Attachment {
  id: string;
  type: "image" | "pdf";
  name: string;           // Original filename
  mimeType: string;       // e.g., "image/png", "application/pdf"
  data: string;           // Base64 encoded data
  preview?: string;       // Thumbnail/preview (base64 for images, generated for PDFs)
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string | ContentPart[];  // String for simple, array for multimodal
}

interface ContentPart {
  type: "text" | "image_url";
  text?: string;
  image_url?: {
    url: string;           // data:image/...;base64,... or https://...
    detail?: "auto" | "low" | "high";
  };
}

// Frontend-only extended message for UI
interface UIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  attachments?: Attachment[];  // For display purposes
}
```

### PDF Handling Strategy
1. Use pdf.js (pdfjs-dist) to render PDF pages to canvas
2. Convert canvas to PNG base64
3. Send each page as a separate image to OpenAI
4. Limit to first N pages (e.g., 5) to avoid token limits

### File Size Limits
- Images: 20MB max (OpenAI limit)
- PDFs: 10MB max (reasonable for page conversion)
- Total attachments per message: 10 files

### Upload Flow
1. User selects/drops/pastes file(s)
2. Client validates type and size
3. Client generates preview (thumbnail for images, first page for PDFs)
4. Files stored in component state as Attachment[]
5. On send: convert to OpenAI content format and POST to API
6. API transforms to OpenAI multimodal message format

## Issues Encountered
| Issue | Resolution |
|-------|------------|
| (none yet) | |

## Resources
- OpenAI Vision Guide: https://platform.openai.com/docs/guides/vision
- Current chat component: `src/components/ChatAssistant.tsx`
- Current API route: `src/app/api/chat/route.ts`
- Current types: `src/lib/types/chat.ts`
- OpenAI config: `src/lib/openai.ts`

## Visual/Browser Findings
(none yet - no browser operations performed)

---
*Update this file after every 2 view/browser/search operations*
*This prevents visual information from being lost*
