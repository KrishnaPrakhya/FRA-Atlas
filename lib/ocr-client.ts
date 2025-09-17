import { BoundingBox, ExtractedEntity, OCRResult, ProcessingStatus } from "@/types/documents";

export class OCRService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_OCR_SERVICE_URL || "http://localhost:8000";
  }

  private async processDocumentWithWebSocket(documentId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(`${this.baseUrl.replace("http", "ws")}/ws/${documentId}`);

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === "status_update") {
          const status = message.data as ProcessingStatus;
          if (status.status === "completed") {
            ws.close();
            resolve();
          } else if (status.status === "failed") {
            ws.close();
            reject(new Error(status.message));
          }
        }
      };

      ws.onerror = (error) => {
        reject(error);
      };
    });
  }

  async processDocument(documentId: string, file: File): Promise<OCRResult> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${this.baseUrl}/ocr/extract-text`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Failed to process document");
    }

    await this.processDocumentWithWebSocket(documentId);
    return response.json();
  }

  async analyzeClaimWithOCR(file: File): Promise<{
    analysis_id: string;
    document_id: string;
    ocr_result: OCRResult;
    dss_recommendation: any;
    total_processing_time: number;
    status: string;
    created_at: string;
  }> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${this.baseUrl}/analyze-claim`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Failed to analyze claim");
    }

    return response.json();
  }

  async checkHealth(): Promise<{
    status: string;
    ocr_ready: boolean;
    ner_ready: boolean;
    pdf_support: boolean;
    supported_languages: string[];
  }> {
    const response = await fetch(`${this.baseUrl}/health`);

    if (!response.ok) {
      throw new Error("OCR service health check failed");
    }

    return response.json();
  }

  async getSupportedLanguages(): Promise<{
    supported_languages: string[];
    language_names: Record<string, string>;
    total_count: number;
  }> {
    const response = await fetch(`${this.baseUrl}/languages`);

    if (!response.ok) {
      throw new Error("Failed to get supported languages");
    }

    return response.json();
  }
}