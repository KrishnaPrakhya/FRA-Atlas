import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

export async function GET() {
  try {
    // Fetch claims with approximate coordinates
    const claimsQuery = `
      SELECT c.*,
             CASE 
               WHEN c.district = 'Dehradun' THEN 30.3165 + (RANDOM() - 0.5) * 0.1
               WHEN c.district = 'Haridwar' THEN 29.9457 + (RANDOM() - 0.5) * 0.1
               ELSE 30.0668 + (RANDOM() - 0.5) * 0.1
             END as lat,
             CASE 
               WHEN c.district = 'Dehradun' THEN 78.0322 + (RANDOM() - 0.5) * 0.1
               WHEN c.district = 'Haridwar' THEN 78.1642 + (RANDOM() - 0.5) * 0.1
               ELSE 79.0193 + (RANDOM() - 0.5) * 0.1
             END as lng
      FROM forest_rights_claims c
      ORDER BY c.submission_date DESC
    `

    // Fetch spatial boundaries
    const boundariesQuery = `
      SELECT * FROM spatial_boundaries
      WHERE geometry_data IS NOT NULL
      ORDER BY created_at DESC
    `

    const [claimsResult, boundariesResult] = await Promise.all([
      executeQuery(claimsQuery),
      executeQuery(boundariesQuery),
    ])

    // Generate sample boundary data if none exists
    let boundaries = boundariesResult.success ? boundariesResult.data : []

    if (boundaries.length === 0) {
      // Create sample boundaries for demonstration
      boundaries = [
        {
          id: 1,
          claim_id: 1,
          boundary_type: "Forest Boundary",
          geometry_data: {
            type: "Polygon",
            coordinates: [
              [
                [78.0322, 30.3165],
                [78.0422, 30.3165],
                [78.0422, 30.3265],
                [78.0322, 30.3265],
                [78.0322, 30.3165],
              ],
            ],
          },
          area_hectares: 25.5,
          perimeter_meters: 2000,
        },
        {
          id: 2,
          claim_id: 3,
          boundary_type: "Claim Area",
          geometry_data: {
            type: "Polygon",
            coordinates: [
              [
                [78.05, 30.32],
                [78.06, 30.32],
                [78.06, 30.33],
                [78.05, 30.33],
                [78.05, 30.32],
              ],
            ],
          },
          area_hectares: 15.0,
          perimeter_meters: 1600,
        },
      ]
    }

    return NextResponse.json({
      success: true,
      data: {
        claims: claimsResult.success ? claimsResult.data : [],
        boundaries,
      },
    })
  } catch (error) {
    console.error("Map data API error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch map data" }, { status: 500 })
  }
}
