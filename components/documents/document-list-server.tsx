import { executeQuery } from "../../lib/database";
import { DocumentList } from "./document-list";

interface DocumentListServerProps {
  filter?: string;
  claimId?: string;
}

export async function DocumentListServer({
  filter,
  claimId,
}: DocumentListServerProps) {
  let query = `
    SELECT d.*, c.claim_number, c.claimant_name 
    FROM claim_documents d
    JOIN forest_rights_claims c ON d.claim_id = c.id
  `;

  const params: any[] = [];
  const conditions: string[] = [];

  if (claimId) {
    conditions.push("d.claim_id = $" + (params.length + 1));
    params.push(claimId);
  }

  if (filter === "processed") {
    conditions.push("d.ocr_text IS NOT NULL");
  } else if (filter === "pending") {
    conditions.push("d.verification_status = $" + (params.length + 1));
    params.push("Pending");
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  query += " ORDER BY d.uploaded_at DESC LIMIT 50";

  const result = await executeQuery(query, params);
  const documents = result.success ? (result.data ?? []) : [];

  return <DocumentList documents={documents} />;
}
