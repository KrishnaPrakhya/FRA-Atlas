/**
 * Types for the document processing and OCR features
 */

export interface Document {
  id: string;
  claim_id: string;
  claim_number: string;
  claimant_name: string;
  original_filename: string;
  document_type: string;
  file_size: number;
  file_type: string;
  file_path: string;
  verification_status: DocumentStatus;
  uploaded_at: string;
  ocr_text?: string;
  entities_extracted?: Record<string, Entity[]>;
  confidence?: number;
  processing_time?: number;
}

export type DocumentStatus = 'Pending' | 'Processing' | 'Verified' | 'Rejected';

export interface Entity {
  id: string;
  type: string;
  value: string;
  confidence: number;
  start_index: number;
  end_index: number;
  verified: boolean;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ExtractedEntity extends Entity {
  bounding_box?: BoundingBox;
}

export interface OCRResult {
  id: string;
  document_id: string;
  extracted_text: string;
  confidence: number;
  language: string;
  processing_time: number;
  bounding_boxes: BoundingBox[];
  entities: ExtractedEntity[];
  status: string;
  created_at: string;
}

export interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  ocrResult?: OCRResult;
  error?: string;
}

export interface DocumentFilter {
  status?: DocumentStatus;
  claimId?: string;
  documentType?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface DocumentSort {
  field: keyof Document;
  direction: 'asc' | 'desc';
}

export interface ProcessingStatus {
  document_id: string;
  status: string;
  progress: number;
  message: string;
  estimated_completion?: number;
}

export interface WSMessage {
  type: 'status_update' | 'error' | 'complete';
  document_id: string;
  data: ProcessingStatus | OCRResult;
}

export interface DocumentStats {
  total: number;
  pending: number;
  processing: number;
  verified: number;
  rejected: number;
  average_confidence: number;
  average_processing_time: number;
}