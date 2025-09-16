"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { useEffect, useState } from "react"

interface ChartData {
  name: string
  value: number
  color: string
}

export function ClaimStatusChart() {
  const [data, setData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/claims/stats")
        const result = await response.json()

        if (result.success) {
          const stats = result.data
          setData([
            { name: "Pending", value: stats.pending_claims || 0, color: "#f97316" },
            { name: "Under Review", value: stats.under_review_claims || 0, color: "#eab308" },
            { name: "Approved", value: stats.approved_claims || 0, color: "#22c55e" },
            { name: "Rejected", value: stats.rejected_claims || 0, color: "#ef4444" },
          ])
        }
      } catch (error) {
        console.error("Failed to fetch chart data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="h-64 flex items-center justify-center">Loading chart...</div>
  }

  const totalClaims = data.reduce((sum, item) => sum + item.value, 0)

  if (totalClaims === 0) {
    return <div className="h-64 flex items-center justify-center text-muted-foreground">No data available</div>
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
