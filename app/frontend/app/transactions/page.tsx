"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ArrowDownLeft, ArrowUpRight, ChevronLeft } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

export default function AllTransactionsPage() {
  const [transactions, setTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  type RawTransaction = {
    id: number
    account_id: number
    transaction_type: "deposit" | "withdrawal"
    amount: string
    transaction_date: string
    transaction_status: string
    destination_account_id: number | null
    account_number: string
  }

  // Map DB to RawTransaction type
  function mapTransactions(rawTransactions: RawTransaction[]) {
    return rawTransactions.map((tx) => {
      const isDeposit = tx.transaction_type === "deposit"

      return {
        id: `t${tx.id}`,
        description: isDeposit ? "Deposit" : "Withdrawal",
        amount: `${isDeposit ? "+" : "-"}$${Number.parseFloat(tx.amount).toFixed(2)}`,
        date: format(new Date(tx.transaction_date), "MMM d h:mm"),
        fullDate: format(new Date(tx.transaction_date), "EEEE, MMMM do yyyy, h:mm a"),
        type: isDeposit ? "income" : "expense",
        category: isDeposit ? "Deposit" : "Withdrawal",
        icon: isDeposit ? ArrowUpRight : ArrowDownLeft,
        account_number: `${tx.account_number.toString().slice(-4)}`,
      }
    })
  }

  useEffect(() => {
    setIsLoading(true)
    fetch("http://localhost:12094/user/transactions", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        // Get all transactions, not just the last few
        setTransactions(mapTransactions(data.transactions.reverse()))
        setIsLoading(false)
      })
      .catch((error) => {
        console.error("Fetch error:", error)
        setIsLoading(false)
      })
  }, [])

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex items-center mb-6">
        <a
          href="/"
          className="px-3 py-1.5 text-sm rounded-md font-medium flex items-center gap-1"
        >
          <span>Back</span>
          <ChevronLeft className="h-3.5 w-3.5" />
        </a>
        <h1 className="text-2xl font-bold">All Transactions</h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-pulse text-center">
            <p className="text-muted-foreground">Loading transactions...</p>
          </div>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>Complete list of all your financial activity</CardDescription>
          </CardHeader>
          <CardContent>
            {transactions.length > 0 ? (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    <Avatar className="border h-9 w-9">
                      <div
                        className={`flex h-full w-full items-center justify-center rounded-full ${
                          transaction.type === "income" ? "bg-green-100 text-green-600" : "bg-primary/10 text-primary"
                        }`}
                      >
                        <transaction.icon className="h-4 w-4" />
                      </div>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{transaction.description}</p>
                        <p
                          className={`font-medium ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}
                        >
                          {transaction.amount}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <p>From Account: (••••{transaction.account_number})</p>
                        <p className="text-black">{transaction.fullDate}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">No transactions found.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
