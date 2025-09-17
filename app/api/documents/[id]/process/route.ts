import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/error-handler";
import { join } from "path";
import { cwd } from "process";
import { readFile } from "fs/promises";
import { processDocumentWithOCR } from "@/lib/ocr";

const UPLOADS_DIR = join(cwd(), "uploads");

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get document from database
    const document = await prisma.claimDocument.findUnique({
      where: { id: params.id },
    });

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Read file from disk
    const filePath = join(UPLOADS_DIR, document.filename);
    const fileBuffer = await readFile(filePath);

    // Process document with OCR
    const { text, entities } = await processDocumentWithOCR(fileBuffer);

    // Update document with OCR results
    const updatedDocument = await prisma.claimDocument.update({
      where: { id: params.id },
      data: {
        ocrText: text,
        extractedEntities: entities,
      },
      include: {
        claim: {
          select: {
            id: true,
            claimNumber: true,
            status: true,
          },
        },
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(updatedDocument);
  } catch (error) {
    return handleApiError(error, request);
  }
}