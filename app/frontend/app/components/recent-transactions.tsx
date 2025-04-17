'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react";
import { ArrowDownLeft, ArrowUpRight, ShoppingBag, Home, Coffee, Car } from "lucide-react"
import { format } from "date-fns";

export function RecentTransactions() {
  const [transactions, setTransactions] = useState([]);

  // const transactions = [
  //   {
  //     id: "t1",
  //     description: "Grocery Store",
  //     amount: "-$56.32",
  //     date: "Today, 2:34 PM",
  //     type: "expense",
  //     category: "Shopping",
  //     icon: ShoppingBag,
  //   },
  //   {
  //     id: "t2",
  //     description: "Salary Deposit",
  //     amount: "+$2,450.00",
  //     date: "May 10, 9:15 AM",
  //     type: "income",
  //     category: "Income",
  //     icon: ArrowDownLeft,
  //   },
  //   {
  //     id: "t3",
  //     description: "Mortgage Payment",
  //     amount: "-$1,450.00",
  //     date: "May 5, 10:00 AM",
  //     type: "expense",
  //     category: "Housing",
  //     icon: Home,
  //   },
  //   {
  //     id: "t4",
  //     description: "Coffee Shop",
  //     amount: "-$4.50",
  //     date: "May 4, 8:30 AM",
  //     type: "expense",
  //     category: "Food",
  //     icon: Coffee,
  //   },
  // ]

  // Current mapping for JSX
  type RawTransaction = {
    id: number;
    account_id: number;
    transaction_type: "deposit" | "withdrawal";
    amount: string; // depends on how backend sends it
    transaction_date: string; // should be ISO string
    transaction_status: string;
    destination_account_id: number | null;
  };

  // Map DB to RawTransaction type
  function mapTransactions(rawTransactions: RawTransaction[]) {
    return rawTransactions.map((tx) => {
      const isDeposit = tx.transaction_type === "deposit";

      return {
        id: `t${tx.id}`,
        description: isDeposit ? "Deposit" : "Withdrawal",
        amount: `${isDeposit ? "+" : "-"}$${parseFloat(tx.amount).toFixed(2)}`,
        date: format(new Date(tx.transaction_date), "EEEE, MMMM do yyyy, h:mm a"),
        // TODO: NEEDS TO CHANGE WHEN WE ADD MORE DIFFERENT TYPES
        type: isDeposit ? "income" : "expense",
        category: isDeposit ? "Deposit" : "Withdrawal",
        icon: isDeposit ? ArrowUpRight : ArrowDownLeft,
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
        setTransactions(mapTransactions(data.transactions.slice(-6).reverse()));
      })
      .catch((error) => console.error("Fetch error:", error));
  }, []);



  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Your latest financial activity</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
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
                  <p className="font-medium">{transaction.description}</p>
                  <p className={`font-medium ${transaction.type === "income" ? "text-green-600" : ""}`}>
                    {transaction.amount}
                  </p>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <p>{transaction.date}</p>
                  <Badge variant="outline">{transaction.category}</Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

