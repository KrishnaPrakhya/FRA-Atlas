// Client for communicating with the AI backend

export interface OCRResult {
  success: boolean
  text: string
  entities?: Record<string, any[]>
  confidence: number
  processing_time: number
}

export interface NERResult {
  success: boolean
  entities: Record<string, any[]>
  processing_time: number
}

export interface DecisionResult {
  success: boolean
  recommendation: string
  confidence: number
  reasoning: string[]
  risk_factors: string[]
}

export interface DocumentAnalysisResult {
  success: boolean
  ocr: {
    text: string
    confidence: number
  }
  entities: Record<string, any[]>
  document_type: string
  processing_time: number
}

class AIClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl = "http://localhost:8000") {
    this.baseUrl = baseUrl
  }

  setAuthToken(token: string) {
    this.token = token
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`
    const headers = {
      ...options.headers,
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Unknown error" }))
      throw new Error(error.detail || `HTTP ${response.status}`)
    }

    return response.json()
  }

  async processOCR(file: File, extractEntities = true): Promise<OCRResult> {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("extract_entities", extractEntities.toString())

    return this.makeRequest("/api/ai/ocr", {
      method: "POST",
      body: formData,
    })
  }

  async processNER(text: string, documentType = "general"): Promise<NERResult> {
    return this.makeRequest("/api/ai/ner", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        document_type: documentType,
      }),
    })
  }

  async getDecisionSupport(claimId: number, factors: Record<string, number>): Promise<DecisionResult> {
    return this.makeRequest("/api/ai/decision", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        claim_id: claimId,
        factors,
      }),
    })
  }

  async analyzeDocument(file: File, documentType = "general"): Promise<DocumentAnalysisResult> {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("document_type", documentType)

    return this.makeRequest("/api/ai/analyze-document", {
      method: "POST",
      body: formData,
    })
  }

  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.makeRequest("/health")
  }
}

// Export singleton instance
export const aiClient = new AIClient()

// React hook for AI client
export function useAIClient() {
  return aiClient
}
