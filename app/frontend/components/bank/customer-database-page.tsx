"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CustomerDatabaseTable } from "@/components/bank/customer-database-table"

export default function CustomerDatabasePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-background px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">Bank Manager Portal</h1>
        </div>
      </header>
      <main className="flex-1 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Database</CardTitle>
            <CardDescription>View and filter customer accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <CustomerDatabaseTable />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
