import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function UpcomingBills() {
  const bills = [
    {
      name: "Mortgage",
      amount: "$1,450.00",
      dueDate: "May 15",
      daysLeft: 5,
      progress: 80,
    },
    {
      name: "Electric Bill",
      amount: "$85.75",
      dueDate: "May 18",
      daysLeft: 8,
      progress: 60,
    },
    {
      name: "Internet",
      amount: "$75.00",
      dueDate: "May 22",
      daysLeft: 12,
      progress: 40,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Bills</CardTitle>
        <CardDescription>Bills due in the next 14 days</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {bills.map((bill) => (
          <div key={bill.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{bill.name}</div>
                <div className="text-sm text-muted-foreground">
                  Due {bill.dueDate} ({bill.daysLeft} days)
                </div>
              </div>
              <div className="font-medium">{bill.amount}</div>
            </div>
            <Progress value={bill.progress} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

