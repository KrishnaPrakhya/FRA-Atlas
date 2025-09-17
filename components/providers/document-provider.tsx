"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";
import type {
  Document,
  DocumentFilter,
  DocumentSort,
  DocumentStats,
  ProcessingStatus,
} from "@/types/documents";

interface DocumentState {
  documents: Document[];
  stats: DocumentStats | null;
  filters: DocumentFilter;
  sort: DocumentSort;
  loading: boolean;
  error: string | null;
  processingStatus: Record<string, ProcessingStatus>;
}

type DocumentAction =
  | { type: "SET_DOCUMENTS"; payload: Document[] }
  | { type: "SET_STATS"; payload: DocumentStats }
  | { type: "SET_FILTERS"; payload: DocumentFilter }
  | { type: "SET_SORT"; payload: DocumentSort }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | {
      type: "UPDATE_PROCESSING_STATUS";
      payload: { documentId: string; status: ProcessingStatus };
    }
  | { type: "UPDATE_DOCUMENT"; payload: Document }
  | { type: "ADD_DOCUMENT"; payload: Document }
  | { type: "REMOVE_DOCUMENT"; payload: string };

const initialState: DocumentState = {
  documents: [],
  stats: null,
  filters: {},
  sort: { field: "uploaded_at", direction: "desc" },
  loading: false,
  error: null,
  processingStatus: {},
};

const DocumentContext = createContext<{
  state: DocumentState;
  dispatch: React.Dispatch<DocumentAction>;
  fetchDocuments: (filter?: DocumentFilter) => Promise<void>;
  fetchStats: () => Promise<void>;
  uploadDocument: (
    file: File,
    claimId: string,
    documentType: string
  ) => Promise<Document>;
  processDocument: (documentId: string) => Promise<void>;
} | null>(null);

function documentReducer(
  state: DocumentState,
  action: DocumentAction
): DocumentState {
  switch (action.type) {
    case "SET_DOCUMENTS":
      return { ...state, documents: action.payload };
    case "SET_STATS":
      return { ...state, stats: action.payload };
    case "SET_FILTERS":
      return { ...state, filters: action.payload };
    case "SET_SORT":
      return { ...state, sort: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "UPDATE_PROCESSING_STATUS":
      return {
        ...state,
        processingStatus: {
          ...state.processingStatus,
          [action.payload.documentId]: action.payload.status,
        },
      };
    case "UPDATE_DOCUMENT":
      return {
        ...state,
        documents: state.documents.map((doc) =>
          doc.id === action.payload.id ? action.payload : doc
        ),
      };
    case "ADD_DOCUMENT":
      return {
        ...state,
        documents: [action.payload, ...state.documents],
      };
    case "REMOVE_DOCUMENT":
      return {
        ...state,
        documents: state.documents.filter((doc) => doc.id !== action.payload),
      };
    default:
      return state;
  }
}

export function DocumentProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(documentReducer, initialState);

  const fetchDocuments = useCallback(async (filter?: DocumentFilter) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      const params = new URLSearchParams();
      if (filter?.status) params.append("status", filter.status);
      if (filter?.claimId) params.append("claimId", filter.claimId);
      if (filter?.documentType)
        params.append("documentType", filter.documentType);
      if (filter?.dateRange) {
        params.append("startDate", filter.dateRange.start.toISOString());
        params.append("endDate", filter.dateRange.end.toISOString());
      }

      const response = await fetch(`/api/documents?${params}`);
      if (!response.ok) throw new Error("Failed to fetch documents");

      const data = await response.json();
      dispatch({ type: "SET_DOCUMENTS", payload: data });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Failed to fetch documents",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch("/api/documents/stats");
      if (!response.ok) throw new Error("Failed to fetch document statistics");

      const data = await response.json();
      dispatch({ type: "SET_STATS", payload: data });
    } catch (error) {
      console.error("Error fetching document stats:", error);
    }
  }, []);

  const uploadDocument = useCallback(
    async (
      file: File,
      claimId: string,
      documentType: string
    ): Promise<Document> => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("claimId", claimId);
      formData.append("documentType", documentType);

      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to upload document");
      }

      const document = await response.json();
      dispatch({ type: "ADD_DOCUMENT", payload: document });
      return document;
    },
    []
  );

  const processDocument = useCallback(async (documentId: string) => {
    try {
      const response = await fetch(`/api/documents/${documentId}/process`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to process document");
      }

      const result = await response.json();
      dispatch({ type: "UPDATE_DOCUMENT", payload: result });
    } catch (error) {
      console.error("Error processing document:", error);
      throw error;
    }
  }, []);

  return (
    <DocumentContext.Provider
      value={{
        state,
        dispatch,
        fetchDocuments,
        fetchStats,
        uploadDocument,
        processDocument,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
}

export function useDocuments() {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error("useDocuments must be used within a DocumentProvider");
  }
  return context;
}
