"use client"

import { useState, useEffect } from "react"
import { BarChart, FileText, Home, PieChart, Settings, Users } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CustomerTable } from "@/components/customer-table"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { ReportGenerator } from "@/components/report-generator"
import { Overview } from "@/components/overview"
import { RecentActivity } from "@/components/recent-activity"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar"

export default function DashboardView() {
  const [activeTab, setActiveTab] = useState("overview")
  const [isBankManager, setIsBankManager] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/bank_manager/info`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        setIsBankManager(data.id);
      })
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  if (!isBankManager) {
    return <div>You do not have access to this page.</div>;
  }

  return (
    <SidebarProvider>
      <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
        <Sidebar>
          <SidebarHeader className="flex h-14 items-center border-b px-6">
            <span className="font-semibold">Bank Manager Portal</span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={activeTab === "overview"} onClick={() => setActiveTab("overview")}>
                  <button>
                    <Home className="h-4 w-4" />
                    <span>Overview</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={activeTab === "customers"}
                  onClick={() => setActiveTab("customers")}
                >
                  <button>
                    <Users className="h-4 w-4" />
                    <span>Customers</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={activeTab === "reports"} onClick={() => setActiveTab("reports")}>
                  <button>
                    <FileText className="h-4 w-4" />
                    <span>Reports</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={activeTab === "analytics"}
                  onClick={() => setActiveTab("analytics")}
                >
                  <button>
                    <BarChart className="h-4 w-4" />
                    <span>Analytics</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button>
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <div className="flex flex-col">
          <DashboardHeader />
          <DashboardShell>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="customers">Customers</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">2,853</div>
                      <p className="text-xs text-muted-foreground">+12% from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
                      <PieChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$12.5M</div>
                      <p className="text-xs text-muted-foreground">+5.2% from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">New Accounts</CardTitle>
                      <BarChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">124</div>
                      <p className="text-xs text-muted-foreground">+18% from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Average Balance</CardTitle>
                      <BarChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$4,385</div>
                      <p className="text-xs text-muted-foreground">+2.5% from last month</p>
                    </CardContent>
                  </Card>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  <Card className="col-span-4">
                    <CardHeader>
                      <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <Overview />
                    </CardContent>
                  </Card>
                  <Card className="col-span-3">
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Latest customer transactions and account changes</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RecentActivity />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="customers" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Database</CardTitle>
                    <CardDescription>View and manage all customer accounts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CustomerTable />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="reports" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Reports</CardTitle>
                    <CardDescription>Generate and view reports</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ReportGenerator />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="analytics" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Analytics Dashboard</CardTitle>
                    <CardDescription>Detailed analytics and insights</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-10">
                      <p className="text-muted-foreground">Analytics dashboard coming soon</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </DashboardShell>
        </div>
      </div>
    </SidebarProvider>
  )
}
