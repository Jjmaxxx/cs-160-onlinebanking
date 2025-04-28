import type { Metadata } from "next"

import DashboardView from "@/components/dashboard-view"

export const metadata: Metadata = {
  title: "Bank Manager Dashboard",
  description: "Generate reports based on customer attributes",
}

export default function DashboardPage() {
  return <DashboardView />
}
