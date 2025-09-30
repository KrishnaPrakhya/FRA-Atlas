import { OCRResult } from "@/types/documents";

const DEFAULT_OCR_URL = process.env.OCR_SERVICE_URL || process.env.NEXT_PUBLIC_OCR_SERVICE_URL || "http://localhost:8000";

/**
 * Send a document buffer to the OCR backend and return a simplified result.
 *
 * Inputs:
 * - fileBuffer: Buffer | Uint8Array containing the file bytes
 *
 * Output:
 * - { text: string, entities: any[] }
 *
 * Error modes:
 * - throws if network error or non-OK response from OCR service
 */
export async function processDocumentWithOCR(fileBuffer: Uint8Array | Buffer) {
  if (!fileBuffer) {
    throw new Error("No file buffer provided to processDocumentWithOCR");
  }

  const url = `${DEFAULT_OCR_URL.replace(/\/$/, "")}/ocr/extract-text`;

  // Ensure we pass an ArrayBuffer/ArrayBufferView to Blob (helps TypeScript and runtime compatibility)
  const uint8 = fileBuffer instanceof Uint8Array ? fileBuffer : new Uint8Array(fileBuffer as any);

  // Create an ArrayBuffer slice that represents only the typed array region
  const arrayBuffer = uint8.buffer.slice(uint8.byteOffset, uint8.byteOffset + uint8.byteLength);

  // Create multipart form data. In Node 18+ / Next.js server runtime FormData and Blob are available.
  const form = new FormData();
  const blob = new Blob([arrayBuffer]);
  // Provide a generic filename; the backend will inspect content when necessary
  form.append("file", blob, "document");

  const res = await fetch(url, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`OCR service error: ${res.status} ${res.statusText} ${txt}`);
  }

  const data: OCRResult | any = await res.json();

  // Normalize shape expected by callers in the codebase
  const text = (data.extracted_text ?? data.extractedText ?? data.ocr_text ?? data.extracted_text) as string;
  const entities = data.entities ?? data.extractedEntities ?? data.entities_extracted ?? [];

  return { text, entities };
}

export default processDocumentWithOCR;
