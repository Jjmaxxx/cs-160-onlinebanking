import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentActivity() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
          <AvatarFallback>AJ</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Alice Johnson</p>
          <p className="text-sm text-muted-foreground">Deposited $1,500.00</p>
        </div>
        <div className="ml-auto font-medium">Today, 2:30 PM</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
          <AvatarFallback>BS</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Bob Smith</p>
          <p className="text-sm text-muted-foreground">Withdrew $750.00</p>
        </div>
        <div className="ml-auto font-medium">Today, 11:15 AM</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
          <AvatarFallback>CW</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Carol Williams</p>
          <p className="text-sm text-muted-foreground">Opened new Investment account</p>
        </div>
        <div className="ml-auto font-medium">Yesterday, 3:45 PM</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
          <AvatarFallback>DB</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">David Brown</p>
          <p className="text-sm text-muted-foreground">Updated contact information</p>
        </div>
        <div className="ml-auto font-medium">Yesterday, 10:30 AM</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
          <AvatarFallback>ED</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Eva Davis</p>
          <p className="text-sm text-muted-foreground">Transferred $5,000.00 to Savings</p>
        </div>
        <div className="ml-auto font-medium">Apr 18, 2023</div>
      </div>
    </div>
  )
}
