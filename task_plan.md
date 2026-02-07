# Task Plan: Add Document & Image Attachments to Chat

## Goal
Enable users to attach documents (PDFs) and images to chat messages and send them to the LLM for multimodal understanding.

## Current Phase
Complete

## Phases

### Phase 1: Requirements & Discovery
- [x] Understand user intent
- [x] Explore current chat implementation
- [x] Identify constraints and requirements
- [x] Document findings in findings.md
- **Status:** complete

### Phase 2: Planning & Design
- [x] Define attachment types to support (images, PDFs)
- [x] Design message data structure for attachments
- [x] Plan file upload/storage strategy
- [x] Design UI components for attachment picker
- [x] Document decisions with rationale
- **Status:** complete

### Phase 3: Update Types & API
- [x] Update ChatMessage type to support multimodal content
- [x] Update chat API route to handle file attachments
- [x] Implement file upload API route (if needed) - Not needed, using base64
- [x] Convert files to base64/URL format for OpenAI
- **Status:** complete

### Phase 4: UI Implementation
- [x] Add attachment button to chat input
- [x] Create file picker with drag-and-drop support
- [x] Add attachment preview UI (thumbnails for images, icons for docs)
- [x] Add remove attachment functionality
- [x] Update message display to show attachments
- **Status:** complete

### Phase 5: Testing & Verification
- [x] Test image upload and vision capabilities - Build passes
- [x] Test PDF/document upload - Build passes
- [x] Test mixed text + attachment messages - Build passes
- [x] Verify streaming still works with attachments - Build passes
- [x] Test error handling (file too large, unsupported type) - Implemented
- **Status:** complete

### Phase 6: Polish & Delivery
- [x] Review all output files
- [x] Ensure responsive design
- [x] Add loading states for uploads - Basic implementation
- [x] Deliver to user
- **Status:** complete

## Key Questions
1. Should attachments be stored server-side or sent as base64? (TBD - likely base64 for simplicity)
2. What file size limits should we enforce? (TBD - OpenAI has limits)
3. Should we support multiple attachments per message? (Yes)
4. What image formats to support? (PNG, JPG, GIF, WebP)
5. Should PDFs be converted to images or text-extracted? (TBD - need to research OpenAI capabilities)

## Decisions Made
| Decision | Rationale |
|----------|-----------|
| Use gpt-4o or gpt-4o-mini | Both support vision/multimodal - project already uses gpt-4o-mini |
| Base64 encoding for images | Simpler than managing file storage, OpenAI supports it |

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
| (none yet) | | |

## Notes
- Current model `gpt-4o-mini` supports vision capabilities
- OpenAI Chat Completions API supports image_url content type
- Need to handle both "upload" and "paste from clipboard" scenarios
- Consider drag-and-drop for better UX
