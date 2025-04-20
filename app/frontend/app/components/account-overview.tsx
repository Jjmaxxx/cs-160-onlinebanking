"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, Eye, EyeOff } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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

export function AccountOverview() {
  const [showBalance, setShowBalance] = useState(true)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [revealedAccounts, setRevealedAccounts] = useState<Record<string, boolean>>({})
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    checking: false,
    savings: false,
  })

  useEffect(() => {
    setLoading(true)
    fetch("http://localhost:12094/user/accounts", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch accounts")
        }
        return response.json()
      })
      .then((data) => {
        const accountsArray = Array.isArray(data) ? data : Object.values(data)
        setAccounts(accountsArray[0])
        setLoading(false)
      })
      .catch((error) => {
        console.error("Fetch error:", error)
        setError("Unable to load your accounts. Please try again later.")
        setLoading(false)
      })
  }, [])

  // Group accounts by type
  const checkingAccounts = accounts.filter((account) => account.account_type === "checking")
  const savingsAccounts = accounts.filter((account) => account.account_type === "savings")

  // Format account number to show only last 4 digits
  const formatAccountNumber = (accountNumber: number) => {
    const accountStr = accountNumber.toString()
    return `••••••${accountStr.slice(-4)}`
  }

  // Format balance with commas and 2 decimal places
  const formatBalance = (balance: string) => {
    const amount = Number.parseFloat(balance)
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }
  const toggleAccountNumberVisibility = (accountId: number) => {
    setRevealedAccounts((prev) => ({
      ...prev,
      [accountId]: !prev[accountId],
    }))
  }
  const toggleExpandSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

   const renderAccountsList = (accounts: Account[], borderColor: string, accountType: string) => {
    if (accounts.length === 0) {
      return <div className="py-4 text-center text-muted-foreground">No accounts found</div>
    }

    // Determine how many accounts to show
    const isExpanded = expandedSections[accountType]
    const visibleAccounts = isExpanded ? accounts : accounts.slice(0, 3)
    const hasMoreAccounts = accounts.length > 3

    return (
      <div className="space-y-4">
        {visibleAccounts.map((account) => (
          <div
            key={account.id}
            className={cn("border rounded-lg p-4 transition-all hover:shadow-md bg-card", `border-l-4 ${borderColor}`)}
          >
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Available Balance</div>
                <div className="text-3xl font-bold">{showBalance ? formatBalance(account.balance) : "$•••••••••"}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Account Number</div>
                  <div
                    className="font-medium cursor-pointer hover:text-primary transition-colors"
                    onClick={() => toggleAccountNumberVisibility(account.id)}
                    title="Click to reveal full account number"
                  >
                    {revealedAccounts[account.id]
                      ? account.account_number
                      : formatAccountNumber(account.account_number)}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Interest Rate</div>
                  <div className="font-medium">{account.interest_rate}% APY</div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {hasMoreAccounts && (
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => toggleExpandSection(accountType)}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4" /> Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" /> Show {accounts.length - 3} More
              </>
            )}
          </Button>
        )}
      </div>
    )
  }

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Account Overview</CardTitle>
          <CardDescription>View your account balances</CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setShowBalance(!showBalance)}>
          {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          <span className="sr-only">{showBalance ? "Hide" : "Show"} balance</span>
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-8 text-center text-muted-foreground">Loading your accounts...</div>
        ) : error ? (
          <div className="py-8 text-center text-red-500">{error}</div>
        ) : (
          <Tabs defaultValue="checking">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="checking">Checking ({checkingAccounts.length})</TabsTrigger>
              <TabsTrigger value="savings">Savings ({savingsAccounts.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="checking" className="pt-4">
              {renderAccountsList(checkingAccounts, "border-emerald-500", "checking")}
            </TabsContent>

            <TabsContent value="savings" className="pt-4">
              {renderAccountsList(savingsAccounts, "border-sky-500", "savings")}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}
