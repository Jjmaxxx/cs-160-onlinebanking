"use client"

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { name: "< $1,000", value: 15, color: "hsl(var(--chart-1))" },
  { name: "$1,000 - $5,000", value: 30, color: "hsl(var(--chart-2))" },
  { name: "$5,000 - $10,000", value: 25, color: "hsl(var(--chart-3))" },
  { name: "$10,000 - $50,000", value: 20, color: "hsl(var(--chart-4))" },
  { name: "> $50,000", value: 10, color: "hsl(var(--chart-5))" },
]

export function BalanceDistributionChart() {
  return (
    <div className="w-full">
      <h3 className="text-lg font-medium mb-4">Customer Balance Distribution</h3>
      <div className="h-[400px]">
        <ChartContainer
          config={{
            "<$1k": {
              label: "< $1,000",
              color: "hsl(var(--chart-1))",
            },
            "$1k-$5k": {
              label: "$1,000 - $5,000",
              color: "hsl(var(--chart-2))",
            },
            "$5k-$10k": {
              label: "$5,000 - $10,000",
              color: "hsl(var(--chart-3))",
            },
            "$10k-$50k": {
              label: "$10,000 - $50,000",
              color: "hsl(var(--chart-4))",
            },
            ">$50k": {
              label: "> $50,000",
              color: "hsl(var(--chart-5))",
            },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={150} fill="#8884d8" dataKey="value">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltipContent />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  )
}
