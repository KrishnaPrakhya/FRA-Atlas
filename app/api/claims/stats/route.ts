import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

export async function GET() {
  try {
    const query = `
      SELECT 
        COUNT(*) as total_claims,
        COUNT(CASE WHEN status = 'Pending' THEN 1 END) as pending_claims,
        COUNT(CASE WHEN status = 'Under Review' THEN 1 END) as under_review_claims,
        COUNT(CASE WHEN status = 'Approved' THEN 1 END) as approved_claims,
        COUNT(CASE WHEN status = 'Rejected' THEN 1 END) as rejected_claims
      FROM forest_rights_claims
    `

    const result = await executeQuery(query)

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: result.data[0],
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
