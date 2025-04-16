"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function AccountOverview() {
  const [showBalance, setShowBalance] = useState(true)

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
        <Tabs defaultValue="checking">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="checking">Checking</TabsTrigger>
            <TabsTrigger value="savings">Savings</TabsTrigger>
            <TabsTrigger value="investment">Investment</TabsTrigger>
          </TabsList>
          <TabsContent value="checking" className="pt-4">
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Available Balance</div>
                <div className="text-3xl font-bold">{showBalance ? "$12,456.78" : "••••••••••"}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Account Number</div>
                  <div className="font-medium">••••••7890</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Interest Rate</div>
                  <div className="font-medium">0.01% APY</div>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="savings" className="pt-4">
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Available Balance</div>
                <div className="text-3xl font-bold">{showBalance ? "$45,678.90" : "••••••••••"}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Account Number</div>
                  <div className="font-medium">••••••3456</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Interest Rate</div>
                  <div className="font-medium">1.25% APY</div>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="investment" className="pt-4">
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Portfolio Value</div>
                <div className="text-3xl font-bold">{showBalance ? "$78,901.23" : "••••••••••"}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Account Number</div>
                  <div className="font-medium">••••••5678</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">YTD Return</div>
                  <div className="font-medium text-green-600">+8.45%</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

