// PDF.js must only be loaded on the client side
// This module should only be imported from client components

let pdfjsLib: typeof import("pdfjs-dist/legacy/build/pdf.mjs") | null = null;

async function getPdfjs() {
  if (typeof window === "undefined") {
    throw new Error("PDF.js can only be used on the client side");
  }

  if (!pdfjsLib) {
    // Use legacy build for better browser compatibility
    pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
    // Use local worker from public folder
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs";
  }

  return pdfjsLib;
}

const MAX_PDF_PAGES = 5;
const PDF_RENDER_SCALE = 1.5; // Good balance between quality and size

export interface PDFPage {
  pageNumber: number;
  dataUrl: string;
}

export async function convertPDFToImages(
  file: File,
  maxPages: number = MAX_PDF_PAGES
): Promise<PDFPage[]> {
  const pdfjs = await getPdfjs();
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

  const numPages = Math.min(pdf.numPages, maxPages);
  const pages: PDFPage[] = [];

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: PDF_RENDER_SCALE });

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Could not get canvas context");

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
      canvasContext: context,
      viewport: viewport,
      canvas: canvas,
    }).promise;

    const dataUrl = canvas.toDataURL("image/png");
    pages.push({ pageNumber: i, dataUrl });
  }

  return pages;
}

export async function getPDFPreview(file: File): Promise<string> {
  const pages = await convertPDFToImages(file, 1);
  return pages[0]?.dataUrl || "";
}
