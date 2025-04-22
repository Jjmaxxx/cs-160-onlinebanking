'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { useState, useEffect } from "react";
import { ArrowDownLeft, ArrowUpRight, ChevronDown, ChevronUp, ChevronRight } from "lucide-react"
import { format } from "date-fns";
import Link from "next/link"


export function RecentTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false)
  // Current mapping for JSX
  type RawTransaction = {
    id: number;
    account_id: number;
    transaction_type: "deposit" | "withdrawal";
    amount: string; 
    transaction_date: string; 
    transaction_status: string;
    destination_account_id: number | null;
    account_number: string;
  };

  // Map DB to RawTransaction type
  function mapTransactions(rawTransactions: RawTransaction[]) {
    return rawTransactions.map((tx) => {
      const isDeposit = tx.transaction_type === "deposit";

      return {
        id: `t${tx.id}`,
        description: isDeposit ? "Deposit" : "Withdrawal",
        amount: `${isDeposit ? "+" : "-"}$${parseFloat(tx.amount).toFixed(2)}`,
        date: format(new Date(tx.transaction_date), "MMM d h:mm"),
        // TODO: NEEDS TO CHANGE WHEN WE ADD MORE DIFFERENT TYPES
        type: isDeposit ? "income" : "expense",
        category: isDeposit ? "Deposit" : "Withdrawal",
        icon: isDeposit ? ArrowUpRight : ArrowDownLeft,
        account_number: `${(tx.account_number).toString().slice(-4)}`
      };
    });
  }

  useEffect(() => {
    fetch("http://localhost:12094/user/transactions", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(mapTransactions(data.transactions).slice(-6));
        //console.log(transactions);
        // NOTE: SLICE REMOVES ALL BUT 6 IN ARRAY
        if(data){
          setTransactions(mapTransactions(data.transactions.slice(-8).reverse()));
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  }, []);


  const displayedTransactions = isExpanded ? transactions : transactions.slice(0, 4);
  const showButton = transactions.length > 4;
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your latest financial activity</CardDescription>
        </div>
        <a
          href="/transactions"
          className="px-3 py-1.5 text-sm rounded-md font-medium flex items-center gap-1"
        >
          <span>View All</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </a>

      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayedTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center gap-4">
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
                  <p className="font-medium">{transaction.description} </p>
                  <p className={`font-medium ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
                    {transaction.amount}
                  </p>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <p>From Account: (••••{transaction.account_number})</p>
                  <p className = "text-black">{transaction.date}</p>
                </div>
              </div>
            </div>
          ))}
          {showButton && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-4 w-full py-2 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
            >
              {isExpanded ? (
                <>
                  <span>Show Less</span>
                  <ChevronUp className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  <span>Show More</span>
                  <ChevronDown className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

