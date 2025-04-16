"use client"

import { useState } from "react"
import Link from "next/link"
import {
  LayoutDashboard,
  CreditCard,
  PiggyBank,
  ArrowRightLeft,
  BarChart4,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface DashboardSidebarProps {
  isOpen: boolean
}

export function DashboardSidebar({ isOpen }: DashboardSidebarProps) {
  const [openAccounts, setOpenAccounts] = useState(true)

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r bg-background transition-transform md:static",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-16",
      )}
    >
      <div className="flex h-16 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2">
          <CreditCard className="h-6 w-6 text-primary" />
          <span className={cn("font-bold", !isOpen && "md:hidden")}>BankApp</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-auto py-4">
        <div className="px-3 py-2">
          <h2 className={cn("mb-2 text-xs font-semibold text-muted-foreground", !isOpen && "md:hidden")}>Menu</h2>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="#" className="flex items-center gap-3">
                <LayoutDashboard className="h-4 w-4" />
                <span className={cn("flex-1", !isOpen && "md:hidden")}>Dashboard</span>
              </Link>
            </Button>

            <Collapsible open={openAccounts} onOpenChange={setOpenAccounts} className="w-full">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-start">
                  <PiggyBank className="h-4 w-4 mr-3" />
                  <span className={cn("flex-1 text-left", !isOpen && "md:hidden")}>Accounts</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      openAccounts ? "transform rotate-180" : "",
                      !isOpen && "md:hidden",
                    )}
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className={cn(!isOpen && "md:hidden")}>
                <div className="pl-8 py-1">
                  <Button variant="ghost" className="w-full justify-start h-8" asChild>
                    <Link href="#">Checking</Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start h-8" asChild>
                    <Link href="#">Savings</Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start h-8" asChild>
                    <Link href="#">Investment</Link>
                  </Button>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="#" className="flex items-center gap-3">
                <ArrowRightLeft className="h-4 w-4" />
                <span className={cn("flex-1", !isOpen && "md:hidden")}>Transactions</span>
              </Link>
            </Button>

            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="#" className="flex items-center gap-3">
                <BarChart4 className="h-4 w-4" />
                <span className={cn("flex-1", !isOpen && "md:hidden")}>Analytics</span>
              </Link>
            </Button>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className={cn("mb-2 text-xs font-semibold text-muted-foreground", !isOpen && "md:hidden")}>Settings</h2>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="#" className="flex items-center gap-3">
                <Settings className="h-4 w-4" />
                <span className={cn("flex-1", !isOpen && "md:hidden")}>Settings</span>
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="#" className="flex items-center gap-3">
                <HelpCircle className="h-4 w-4" />
                <span className={cn("flex-1", !isOpen && "md:hidden")}>Help & Support</span>
              </Link>
            </Button>
          </div>
        </div>
      </nav>
      <div className="border-t p-3">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
        >
          <LogOut className="h-4 w-4 mr-3" />
          <span className={cn("flex-1", !isOpen && "md:hidden")}>Logout</span>
        </Button>
      </div>
    </aside>
  )
}

