"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "./dashboard-header"
import { DashboardSidebar } from "./dashboard-sidebar"
import { AccountOverview } from "./account-overview"
import { RecentTransactions } from "./recent-transactions"
import { QuickActions } from "./quick-actions"
import { FinancialInsights } from "./financial-insights"
import { UpcomingBills } from "./upcoming-bills"
import Navbar from '../components/Navbar';
import { ScheduledBills } from "./scheduled-bills";
import { useAuth } from '../context/AuthContext';

type Account = {
  id: number
  account_number: number
  account_type: string
  account_status: string
  balance: string
  created_at: string
  user_id: number
  interest_rate: number
}

export function DashboardPage() {
  const { isLoggedIn } = useAuth()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const fetchAccounts = async () => {
    const response = await fetch("http://localhost:12094/user/accounts", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch accounts")
    }
    const data = await response.json();
    const accountsArray = Array.isArray(data) ? data : Object.values(data)
    setAccounts(accountsArray[0])
    return data.accounts;
  }
  useEffect(() => {
    fetchAccounts();
  }, [])

  return (
    <div>
    <Navbar />
    {isLoggedIn ? (
    <div className="flex min-h-screen bg-background">
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-4 md:p-6 space-y-6 overflow-auto">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AccountOverview accounts={accounts} fetchAccounts={fetchAccounts}/>
            <QuickActions accounts={accounts} fetchAccounts={fetchAccounts}/>
            
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <ScheduledBills />
            <RecentTransactions />
            {/* <FinancialInsights /> */}
          </div>
        </main>
      </div>
    </div>
    ) : (
      <div>Please login first to view.</div>
    )}
    </div>
  )
}

