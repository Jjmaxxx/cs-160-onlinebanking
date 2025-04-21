"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  {
    month: "Jan",
    deposits: 4000,
    withdrawals: 2400,
    newAccounts: 24,
  },
  {
    month: "Feb",
    deposits: 3000,
    withdrawals: 1398,
    newAccounts: 18,
  },
  {
    month: "Mar",
    deposits: 2000,
    withdrawals: 9800,
    newAccounts: 12,
  },
  {
    month: "Apr",
    deposits: 2780,
    withdrawals: 3908,
    newAccounts: 15,
  },
  {
    month: "May",
    deposits: 1890,
    withdrawals: 4800,
    newAccounts: 21,
  },
  {
    month: "Jun",
    deposits: 2390,
    withdrawals: 3800,
    newAccounts: 25,
  },
  {
    month: "Jul",
    deposits: 3490,
    withdrawals: 4300,
    newAccounts: 30,
  },
]

export function Overview() {
  return (
    <ChartContainer
      config={{
        deposits: {
          label: "Deposits",
          color: "hsl(var(--chart-1))",
        },
        withdrawals: {
          label: "Withdrawals",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip content={<ChartTooltipContent />} />
          <Area
            type="monotone"
            dataKey="deposits"
            stroke="var(--color-deposits)"
            fill="var(--color-deposits)"
            fillOpacity={0.2}
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="withdrawals"
            stroke="var(--color-withdrawals)"
            fill="var(--color-withdrawals)"
            fillOpacity={0.2}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
