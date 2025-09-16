import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { executeQuery } from "@/lib/database"
import { getCurrentUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const claimId = formData.get("claimId") as string
    const documentType = formData.get("documentType") as string

    if (!file || !claimId || !documentType) {
      return NextResponse.json(
        {
          success: false,
          error: "File, claim ID, and document type are required",
        },
        { status: 400 },
      )
    }

    // Validate claim exists
    const claimCheck = await executeQuery("SELECT id FROM forest_rights_claims WHERE claim_number = $1", [claimId])

    if (!claimCheck.success || claimCheck.data.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Claim not found",
        },
        { status: 404 },
      )
    }

    const claimDbId = claimCheck.data[0].id

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "uploads", "documents")
    await mkdir(uploadsDir, { recursive: true })

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `${timestamp}_${file.name}`
    const filepath = join(uploadsDir, filename)

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // Save document record to database
    const insertQuery = `
      INSERT INTO claim_documents 
      (claim_id, document_type, original_filename, file_path, file_size, mime_type, verification_status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `

    const result = await executeQuery(insertQuery, [
      claimDbId,
      documentType,
      file.name,
      filepath,
      file.size,
      file.type,
      "Pending",
    ])

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to save document record",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      documentId: result.data[0].id,
      message: "Document uploaded successfully",
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}
