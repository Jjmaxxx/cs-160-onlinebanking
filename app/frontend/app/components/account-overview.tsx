"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, Eye, EyeOff, Plus, MoreVertical } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { AccountDropdown } from "./account-dropdown.jsx"

interface Account {
  id: number
  account_number: number
  account_type: string
  balance: string
  interest_rate: number
}

export function AccountOverview({
  accounts,
  fetchAccounts,
}: {
  accounts: Account[]
  fetchAccounts: () => Promise<void>
}) {
  const [showBalance, setShowBalance] = useState(true)

  const [error, setError] = useState<string | null>(null)
  const [revealedAccounts, setRevealedAccounts] = useState<Record<string, boolean>>({})
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    checking: false,
    savings: false,
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [accountType, setAccountType] = useState("checking")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false)
  const [accountToClose, setAccountToClose] = useState<number | null>(null)
  const [openPopoverId, setOpenPopoverId] = useState<number | null>(null)
  const [selectedTransferAccount, setSelectedTransferAccount] = useState<Account | null>(null)

  useEffect(() => {
    fetchAccounts()
  }, [])

  const checkingAccounts = accounts.filter((account) => account.account_type === "checking")
  const savingsAccounts = accounts.filter((account) => account.account_type === "savings")

  const formatAccountNumber = (accountNumber: number) => {
    const accountStr = accountNumber.toString()
    return `••••••${accountStr.slice(-4)}`
  }

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

  const handleOpenAccount = async () => {
    setIsSubmitting(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/open_account`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account_type: accountType,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to open account")
      }

      const data = await response.json()

      setIsDialogOpen(false)
      fetchAccounts()

      toast(`Your new ${accountType} account has been successfully opened.`)
    } catch (error) {
      console.error("Error opening account:", error)
      toast(`Failed to open account. Please try again later.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseAccount = async () => {
    if (!accountToClose) return

    setIsSubmitting(true)

    try {
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/accounts/close_account`)
      url.searchParams.append("account_id", accountToClose.toString())
      if (selectedTransferAccount) {
        url.searchParams.append("dest_account_id", selectedTransferAccount.id.toString())
      }

      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to close account")
      }

      setIsCloseDialogOpen(false)
      setAccountToClose(null)
      setOpenPopoverId(null)
      setSelectedTransferAccount(null)
      fetchAccounts()

      toast("Your account has been successfully closed.")
    } catch (error) {
      console.error("Error closing account:", error)
      toast("Failed to close account. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Find the account object by ID
  const getAccountById = (id: number | null) => {
    if (!id) return null
    return accounts.find((account) => account.id === id) || null
  }

  // Get the account to close as an object
  const accountToCloseObj = getAccountById(accountToClose)

  // Get available accounts for transfer (all accounts except the one being closed)
  const availableTransferAccounts = accounts.filter((account) => account.id !== accountToClose)

  // Check if the account being closed has a balance
  const hasBalance = accountToCloseObj && Number.parseFloat(accountToCloseObj.balance) > 0

  const renderAccountsList = (accounts: Account[], borderColor: string, accountType: string) => {
    if (accounts.length === 0) {
      return <div className="py-4 text-center text-muted-foreground">No accounts found</div>
    }

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
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Available Balance</div>
                  <div className="text-3xl font-bold">
                    {showBalance ? formatBalance(account.balance) : "$•••••••••"}
                  </div>
                </div>
                <Popover
                  open={openPopoverId === account.id}
                  onOpenChange={(open) => {
                    if (open) {
                      setOpenPopoverId(account.id)
                    } else {
                      setOpenPopoverId(null)
                    }
                  }}
                >
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-40 p-0" align="end">
                    <button
                      className="w-full px-3 py-2 text-red-500 hover:bg-red-50 border border-red-200 rounded-md m-2"
                      onClick={() => {
                        setAccountToClose(account.id)
                        setIsCloseDialogOpen(true)
                        setOpenPopoverId(null)
                      }}
                    >
                      Close Account
                    </button>
                  </PopoverContent>
                </Popover>
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
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setShowBalance(!showBalance)}>
            {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span className="sr-only">{showBalance ? "Hide" : "Show"} balance</span>
          </Button>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="flex items-center gap-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus className="h-4 w-4" /> Open Account
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Open New Account</DialogTitle>
                <DialogDescription>Choose the type of account you would like to open.</DialogDescription>
              </DialogHeader>

              <div className="py-4">
                <RadioGroup value={accountType} onValueChange={setAccountType} className="grid grid-cols-2 gap-4">
                  {["checking", "savings"].map((type) => (
                    <Label
                      key={type}
                      htmlFor={type}
                      className={cn(
                        "flex flex-col border-2 rounded-lg p-4 cursor-pointer transition-all",
                        accountType === type ? "border-emerald-600 bg-emerald-50" : "border-muted",
                      )}
                    >
                      <RadioGroupItem value={type} id={type} className="hidden" />
                      <span className="font-medium capitalize">{type}</span>
                      <span className="text-sm text-muted-foreground">
                        {type === "checking" ? "For everyday transactions" : "Earn interest on your money"}
                      </span>
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button
                  onClick={handleOpenAccount}
                  disabled={isSubmitting}
                  className="bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {isSubmitting ? "Opening..." : "Open Account"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
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
      </CardContent>
      <Dialog open={isCloseDialogOpen} onOpenChange={setIsCloseDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Close Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to close this account? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {/* Show transfer options if account has balance */}
          {hasBalance && (
            <div className="py-4 space-y-4">
              <div className="font-medium">
                This account has a balance of {accountToCloseObj ? formatBalance(accountToCloseObj.balance) : "$0.00"}
              </div>

              {availableTransferAccounts.length > 0 ? (
                <>
                  <div className="text-sm text-muted-foreground mb-2">
                    Please select an account to transfer the remaining balance to:
                  </div>
                  <AccountDropdown
                    accounts={availableTransferAccounts}
                    selectedAccount={selectedTransferAccount}
                    onChange={setSelectedTransferAccount}
                  />
                </>
              ) : (
                <div className="text-amber-600 bg-amber-50 p-3 rounded-md border border-amber-200">
                  Warning: You have no other accounts to transfer the funds to. If you close this account, the remaining
                  balance will be forfeited.
                </div>
              )}
            </div>
          )}

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsCloseDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              onClick={handleCloseAccount}
              disabled={
                isSubmitting || (hasBalance && availableTransferAccounts.length > 0 && !selectedTransferAccount)
              }
              variant="destructive"
            >
              {isSubmitting ? "Closing..." : "Close Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
