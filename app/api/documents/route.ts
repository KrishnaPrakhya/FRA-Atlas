import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/error-handler";
import { DocumentStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as DocumentStatus | null;
    const claimId = searchParams.get("claimId");
    const fileType = searchParams.get("documentType");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const where = {
      ...(status && { verificationStatus: status }),
      ...(claimId && { claimId }),
      ...(fileType && { fileType }),
      ...(startDate && endDate && {
        uploadDate: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      }),
    };

    const documents = await prisma.claimDocument.findMany({
      where,
      orderBy: { uploadDate: "desc" },
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

    return NextResponse.json(documents);
  } catch (error) {
    return handleApiError(error, request);
  }
}