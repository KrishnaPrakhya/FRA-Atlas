
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function getPolygonCenter(coordinates: number[][][]): [number, number] {
    if (!coordinates || !coordinates[0] || coordinates[0].length === 0) {
        return [0, 0];
    }
    const coords = coordinates[0];
    let latSum = 0;
    let lngSum = 0;
    coords.forEach(([lng, lat]) => {
        latSum += lat;
        lngSum += lng;
    });
    return [latSum / coords.length, lngSum / coords.length];
}

export async function GET() {
    try {
        const claims = await prisma.forestRightsClaim.findMany({
            include: {
                spatialBoundaries: true,
            },
        });

        const boundaries = await prisma.spatialBoundary.findMany();

        const claimsWithCentroids = claims.map(claim => {
            const claimBoundary = claim.spatialBoundaries.find(b => b.boundaryType === 'Claim Area');
            let lat, lng;
            if (claimBoundary && claimBoundary.geoJsonData) {
                const geoJson = claimBoundary.geoJsonData as any;
                if (geoJson.type === 'Polygon') {
                    [lat, lng] = getPolygonCenter(geoJson.coordinates);
                }
            }
            if (!lat || !lng) {
                lat = 30.3165 + (Math.random() - 0.5) * 0.1;
                lng = 78.0322 + (Math.random() - 0.5) * 0.1;
            }
            const { spatialBoundaries, ...claimData } = claim;
            return { ...claimData, lat, lng };
        });

        return NextResponse.json({
            success: true,
            data: {
                claims: claimsWithCentroids,
                boundaries: boundaries,
            },
        });
    } catch (error) {
        console.error("Failed to fetch map data:", error);
        return NextResponse.json({ success: false, message: "Failed to fetch map data" }, { status: 500 });
    }
}
