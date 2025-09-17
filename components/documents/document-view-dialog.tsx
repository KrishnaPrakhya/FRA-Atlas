"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { OCRResultsDisplay } from "./ocr-results-display";

interface DocumentViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  documentData: any; // Replace with proper type
}

export function DocumentViewDialog({
  isOpen,
  onClose,
  documentData,
}: DocumentViewDialogProps) {
  if (!documentData) return null;

  const ocrResult = {
    id: documentData.id,
    document_id: documentData.id,
    extracted_text: documentData.ocr_text || "",
    confidence: documentData.confidence || 0,
    language: "en", // Default to English
    processing_time: 0, // This might not be stored
    entities: documentData.entities_extracted
      ? Object.entries(documentData.entities_extracted).flatMap(
          ([type, values]) =>
            (Array.isArray(values) ? values : []).map((value: any, index) => ({
              id: `${type}-${index}`,
              type,
              value:
                typeof value === "string" ? value : value.text || value.value,
              confidence: value.confidence || 0.8,
              start_index: value.start_index || 0,
              end_index: value.end_index || 0,
              verified: value.verified || false,
            }))
        )
      : [],
    status: documentData.verification_status,
    created_at: documentData.uploaded_at,
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] overflow-y-auto">
        <OCRResultsDisplay result={ocrResult} />
      </DialogContent>
    </Dialog>
  );
}
