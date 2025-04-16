import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRightLeft, CreditCard, Send, Plus } from "lucide-react"

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common banking tasks</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Button className="w-full justify-start" variant="outline">
          <Send className="mr-2 h-4 w-4" />
          Send Money
        </Button>
        <Button className="w-full justify-start" variant="outline">
          <ArrowRightLeft className="mr-2 h-4 w-4" />
          Transfer Between Accounts
        </Button>
        <Button className="w-full justify-start" variant="outline">
          <CreditCard className="mr-2 h-4 w-4" />
          Pay Bills
        </Button>
        <Button className="w-full justify-start" variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Deposit Funds
        </Button>
      </CardContent>
    </Card>
  )
}

