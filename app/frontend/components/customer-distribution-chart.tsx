"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  {
    zipCode: "10001",
    checking: 45,
    savings: 30,
    investment: 15,
  },
  {
    zipCode: "90210",
    checking: 35,
    savings: 40,
    investment: 25,
  },
  {
    zipCode: "60601",
    checking: 50,
    savings: 25,
    investment: 30,
  },
  {
    zipCode: "75001",
    checking: 40,
    savings: 35,
    investment: 10,
  },
]

export function CustomerDistributionChart() {
  return (
    <div className="w-full">
      <h3 className="text-lg font-medium mb-4">Customer Distribution by Zip Code and Account Type</h3>
      <div className="h-[400px]">
        <ChartContainer
          config={{
            checking: {
              label: "Checking",
              color: "hsl(var(--chart-1))",
            },
            savings: {
              label: "Savings",
              color: "hsl(var(--chart-2))",
            },
            investment: {
              label: "Investment",
              color: "hsl(var(--chart-3))",
            },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="zipCode" />
              <YAxis />
              <Tooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="checking" fill="var(--color-checking)" radius={4} />
              <Bar dataKey="savings" fill="var(--color-savings)" radius={4} />
              <Bar dataKey="investment" fill="var(--color-investment)" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  )
}
