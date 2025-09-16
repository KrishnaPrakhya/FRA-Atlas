import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

// Create a reusable SQL client
export const sql = neon(process.env.DATABASE_URL)

// Database utility functions
export async function executeQuery(query: string, params: any[] = []) {
  try {
    const result = await sql(query, params)
    return { success: true, data: result }
  } catch (error) {
    console.error("Database query error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

// Specific query functions for FRA Atlas
export async function getClaimsByStatus(status: string) {
  const query = `
    SELECT c.*, COUNT(d.id) as document_count 
    FROM forest_rights_claims c 
    LEFT JOIN claim_documents d ON c.id = d.claim_id 
    WHERE c.status = $1 
    GROUP BY c.id 
    ORDER BY c.submission_date DESC
  `
  return executeQuery(query, [status])
}

export async function getClaimById(id: number) {
  const query = `
    SELECT c.*, 
           json_agg(
             json_build_object(
               'id', d.id,
               'document_type', d.document_type,
               'original_filename', d.original_filename,
               'verification_status', d.verification_status,
               'uploaded_at', d.uploaded_at
             )
           ) FILTER (WHERE d.id IS NOT NULL) as documents
    FROM forest_rights_claims c 
    LEFT JOIN claim_documents d ON c.id = d.claim_id 
    WHERE c.id = $1 
    GROUP BY c.id
  `
  return executeQuery(query, [id])
}

export async function createClaim(claimData: {
  claimNumber: string
  claimantName: string
  claimantContact?: string
  villageName: string
  district: string
  state: string
  forestAreaHectares?: number
  claimType: string
}) {
  const query = `
    INSERT INTO forest_rights_claims 
    (claim_number, claimant_name, claimant_contact, village_name, district, state, forest_area_hectares, claim_type)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `
  return executeQuery(query, [
    claimData.claimNumber,
    claimData.claimantName,
    claimData.claimantContact,
    claimData.villageName,
    claimData.district,
    claimData.state,
    claimData.forestAreaHectares,
    claimData.claimType,
  ])
}

export async function updateClaimStatus(id: number, status: string, userId?: string) {
  const query = `
    UPDATE forest_rights_claims 
    SET status = $1, updated_at = CURRENT_TIMESTAMP 
    WHERE id = $2 
    RETURNING *
  `
  const result = await executeQuery(query, [status, id])

  // Log to audit trail
  if (result.success && userId) {
    await logAuditTrail("forest_rights_claims", id, "UPDATE", { status }, userId)
  }

  return result
}

export async function logAuditTrail(
  tableName: string,
  recordId: number,
  action: string,
  newValues: any,
  userId: string,
  oldValues?: any,
) {
  const query = `
    INSERT INTO audit_trail (table_name, record_id, action, old_values, new_values, changed_by)
    VALUES ($1, $2, $3, $4, $5, $6)
  `
  return executeQuery(query, [
    tableName,
    recordId,
    action,
    oldValues ? JSON.stringify(oldValues) : null,
    JSON.stringify(newValues),
    userId,
  ])
}
