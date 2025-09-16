import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"
import { getCurrentUser } from "@/lib/auth"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
    }

    const { ocrText, entities, confidence } = await request.json()
    const documentId = params.id

    // Update document with AI processing results
    const updateQuery = `
      UPDATE claim_documents 
      SET 
        ocr_text = $1,
        entities_extracted = $2,
        verification_status = CASE 
          WHEN $3 > 0.8 THEN 'Verified'
          WHEN $3 > 0.5 THEN 'Pending'
          ELSE 'Rejected'
        END
      WHERE id = $4
      RETURNING *
    `

    const result = await executeQuery(updateQuery, [ocrText, JSON.stringify(entities), confidence, documentId])

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to update document",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      document: result.data[0],
      message: "Document processed successfully",
    })
  } catch (error) {
    console.error("Processing error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}
