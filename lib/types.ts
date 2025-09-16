// Type definitions for FRA Atlas system

export interface ForestRightsClaim {
  id: number
  claim_number: string
  claimant_name: string
  claimant_contact?: string
  village_name: string
  district: string
  state: string
  forest_area_hectares?: number
  claim_type: "Individual" | "Community"
  status: "Pending" | "Under Review" | "Approved" | "Rejected"
  submission_date: string
  verification_date?: string
  approval_date?: string
  created_at: string
  updated_at: string
  documents?: ClaimDocument[]
  document_count?: number
}

export interface ClaimDocument {
  id: number
  claim_id: number
  document_type: string
  original_filename: string
  file_path: string
  file_size?: number
  mime_type?: string
  ocr_text?: string
  entities_extracted?: any
  verification_status: "Pending" | "Verified" | "Rejected"
  uploaded_at: string
}

export interface SpatialBoundary {
  id: number
  claim_id: number
  boundary_type: string
  geometry_data: any // GeoJSON
  area_hectares?: number
  perimeter_meters?: number
  created_at: string
}

export interface Official {
  id: number
  user_id?: string
  name: string
  designation: string
  department: string
  district?: string
  state?: string
  contact_number?: string
  is_active: boolean
  created_at: string
}

export interface ClaimWorkflow {
  id: number
  claim_id: number
  stage: string
  assigned_official_id?: number
  status: string
  comments?: string
  stage_started_at: string
  stage_completed_at?: string
  created_at: string
}

export interface DecisionFactor {
  id: number
  claim_id: number
  factor_type: "Environmental" | "Social" | "Legal"
  factor_name: string
  factor_value: number
  weight: number
  source?: string
  calculated_at: string
}

export interface BlockchainRecord {
  id: number
  claim_id: number
  transaction_hash: string
  block_number?: number
  contract_address?: string
  event_type: string
  transaction_data?: any
  gas_used?: number
  transaction_fee?: number
  created_at: string
}

export interface AuditTrail {
  id: number
  table_name: string
  record_id: number
  action: "INSERT" | "UPDATE" | "DELETE"
  old_values?: any
  new_values?: any
  changed_by?: string
  changed_at: string
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Form types
export interface CreateClaimForm {
  claimantName: string
  claimantContact?: string
  villageName: string
  district: string
  state: string
  forestAreaHectares?: number
  claimType: "Individual" | "Community"
}

export interface DocumentUploadForm {
  claimId: number
  documentType: string
  file: File
}
