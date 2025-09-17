import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/error-handler";
import { writeFile } from "fs/promises";
import { join } from "path";
import { cwd } from "process";

const UPLOADS_DIR = join(cwd(), "uploads");

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const claimId = formData.get("claimId") as string;
    const documentType = formData.get("documentType") as string;

    if (!file || !claimId || !documentType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    await writeFile(UPLOADS_DIR, "", { flag: "a" });

    // Save file to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uniqueFilename = `${Date.now()}-${file.name}`;
    const filePath = join(UPLOADS_DIR, uniqueFilename);
    await writeFile(filePath, buffer);

    // Create document record in database
    const document = await prisma.claimDocument.create({
      data: {
        filename: uniqueFilename,
        fileType: documentType,
        fileSize: buffer.length,
        claimId,
        // Get user ID from auth session
        uploadedById: "TODO: Get from auth session",
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

    return NextResponse.json(document);
  } catch (error) {
    return handleApiError(error, request);
  }
}