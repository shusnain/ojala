import {
  MAX_IMAGE_SIZE,
  MAX_PDF_SIZE,
  MAX_ATTACHMENTS,
  SUPPORTED_IMAGE_TYPES,
  SUPPORTED_PDF_TYPES,
  type Attachment,
} from "./types/chat";

export type FileType = "image" | "pdf" | "unsupported";

export function getFileType(file: File): FileType {
  if (SUPPORTED_IMAGE_TYPES.includes(file.type)) return "image";
  if (SUPPORTED_PDF_TYPES.includes(file.type)) return "pdf";
  return "unsupported";
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  const fileType = getFileType(file);

  if (fileType === "unsupported") {
    return {
      valid: false,
      error: `Unsupported file type: ${file.type || "unknown"}. Supported: images (PNG, JPG, GIF, WebP) and PDFs.`,
    };
  }

  if (fileType === "image" && file.size > MAX_IMAGE_SIZE) {
    return {
      valid: false,
      error: `Image too large: ${formatFileSize(file.size)}. Maximum: ${formatFileSize(MAX_IMAGE_SIZE)}.`,
    };
  }

  if (fileType === "pdf" && file.size > MAX_PDF_SIZE) {
    return {
      valid: false,
      error: `PDF too large: ${formatFileSize(file.size)}. Maximum: ${formatFileSize(MAX_PDF_SIZE)}.`,
    };
  }

  return { valid: true };
}

export function validateAttachmentCount(
  currentCount: number,
  newCount: number
): { valid: boolean; error?: string } {
  if (currentCount + newCount > MAX_ATTACHMENTS) {
    return {
      valid: false,
      error: `Too many attachments. Maximum: ${MAX_ATTACHMENTS}. Current: ${currentCount}.`,
    };
  }
  return { valid: true };
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix to get just the base64 string
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function createImageAttachment(file: File): Promise<Attachment> {
  const dataUrl = await fileToDataUrl(file);

  return {
    id: crypto.randomUUID(),
    type: "image",
    name: file.name,
    mimeType: file.type,
    data: dataUrl,
    preview: dataUrl, // For images, preview is the same as data
  };
}

export async function createPDFAttachment(
  file: File,
  previewDataUrl: string
): Promise<Attachment> {
  const dataUrl = await fileToDataUrl(file);

  return {
    id: crypto.randomUUID(),
    type: "pdf",
    name: file.name,
    mimeType: file.type,
    data: dataUrl,
    preview: previewDataUrl,
  };
}
