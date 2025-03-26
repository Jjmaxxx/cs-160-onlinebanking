"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "next-themes"

export function FinancialInsights() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // These would normally come from your data source
  const monthlyData = {
    income: 4500,
    expenses: 3200,
    savings: 1300,
    categories: [
      { name: "Housing", value: 1450, color: "hsl(var(--primary))" },
      { name: "Food", value: 650, color: "hsl(var(--primary) / 0.8)" },
      { name: "Transportation", value: 350, color: "hsl(var(--primary) / 0.6)" },
      { name: "Utilities", value: 280, color: "hsl(var(--primary) / 0.4)" },
      { name: "Entertainment", value: 220, color: "hsl(var(--primary) / 0.3)" },
      { name: "Other", value: 250, color: "hsl(var(--primary) / 0.2)" },
    ],
  }

  const yearlyData = {
    income: 54000,
    expenses: 38400,
    savings: 15600,
    categories: [
      { name: "Housing", value: 17400, color: "hsl(var(--primary))" },
      { name: "Food", value: 7800, color: "hsl(var(--primary) / 0.8)" },
      { name: "Transportation", value: 4200, color: "hsl(var(--primary) / 0.6)" },
      { name: "Utilities", value: 3360, color: "hsl(var(--primary) / 0.4)" },
      { name: "Entertainment", value: 2640, color: "hsl(var(--primary) / 0.3)" },
      { name: "Other", value: 3000, color: "hsl(var(--primary) / 0.2)" },
    ],
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Insights</CardTitle>
        <CardDescription>Your spending patterns and savings</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="monthly">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
          <TabsContent value="monthly" className="pt-4 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">Income</div>
                <div className="text-xl font-bold">${monthlyData.income.toLocaleString()}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">Expenses</div>
                <div className="text-xl font-bold">${monthlyData.expenses.toLocaleString()}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">Savings</div>
                <div className="text-xl font-bold text-green-600">${monthlyData.savings.toLocaleString()}</div>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-2">Spending by Category</div>
              <div className="space-y-2">
                {monthlyData.categories.map((category) => (
                  <div key={category.name} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>{category.name}</span>
                      <span>${category.value.toLocaleString()}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(category.value / monthlyData.expenses) * 100}%`,
                          backgroundColor: category.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="yearly" className="pt-4 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">Income</div>
                <div className="text-xl font-bold">${yearlyData.income.toLocaleString()}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">Expenses</div>
                <div className="text-xl font-bold">${yearlyData.expenses.toLocaleString()}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">Savings</div>
                <div className="text-xl font-bold text-green-600">${yearlyData.savings.toLocaleString()}</div>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-2">Spending by Category</div>
              <div className="space-y-2">
                {yearlyData.categories.map((category) => (
                  <div key={category.name} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>{category.name}</span>
                      <span>${category.value.toLocaleString()}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(category.value / yearlyData.expenses) * 100}%`,
                          backgroundColor: category.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

