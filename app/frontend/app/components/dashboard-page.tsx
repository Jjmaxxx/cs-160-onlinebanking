"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { AccountOverview } from "@/components/account-overview"
import { RecentTransactions } from "@/components/recent-transactions"
import { QuickActions } from "@/components/quick-actions"
import { FinancialInsights } from "@/components/financial-insights"
import { UpcomingBills } from "@/components/upcoming-bills"

export function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar isOpen={isSidebarOpen} />
      <div className="flex-1 flex flex-col">
        <DashboardHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
        <main className="flex-1 p-4 md:p-6 space-y-6 overflow-auto">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AccountOverview />
            <QuickActions />
            <UpcomingBills />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <RecentTransactions />
            <FinancialInsights />
          </div>
        </main>
      </div>
    </div>
  )
}

