import type { Metadata } from "next"

import CustomerDatabasePage from "@/components/bank/customer-database-page"

export const metadata: Metadata = {
  title: "Customer Database",
  description: "View and filter customer data",
}

export default function HomePage() {
  return <CustomerDatabasePage />
}
