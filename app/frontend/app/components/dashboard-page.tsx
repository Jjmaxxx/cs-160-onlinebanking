"use client"

import { useState } from "react"
import { DashboardHeader } from "./dashboard-header"
import { DashboardSidebar } from "./dashboard-sidebar"
import { AccountOverview } from "./account-overview"
import { RecentTransactions } from "./recent-transactions"
import { QuickActions } from "./quick-actions"
import { FinancialInsights } from "./financial-insights"
import { UpcomingBills } from "./upcoming-bills"

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

