"use client"

import { useState } from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type FilterFn,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, Download, MoreHorizontal, Search, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"

// Update the Customer type to include the new fields
type Customer = {
  id: string
  name: string
  email: string
  zipCode: string
  accountType: string
  balance: number
  status: "active" | "inactive" | "pending"
  totalAccounts: number
  totalDeposited: number
  totalWithdrawn: number
  totalTransferred: number
  totalReceived: number
}

// Update the sample data to include the new fields
const data: Customer[] = [
  {
    id: "CUST-001",
    name: "Alice Johnson",
    email: "alice@example.com",
    zipCode: "10001",
    accountType: "Checking",
    balance: 5240.5,
    status: "active",
    totalAccounts: 2,
    totalDeposited: 12500.75,
    totalWithdrawn: 7260.25,
    totalTransferred: 3500.0,
    totalReceived: 4000.0,
  },
  {
    id: "CUST-002",
    name: "Robert Smith",
    email: "robert@example.com",
    zipCode: "90210",
    accountType: "Savings",
    balance: 12750.75,
    status: "active",
    totalAccounts: 1,
    totalDeposited: 15000.0,
    totalWithdrawn: 2249.25,
    totalTransferred: 1000.0,
    totalReceived: 1000.0,
  },
  {
    id: "CUST-003",
    name: "Carol Williams",
    email: "carol@example.com",
    zipCode: "60601",
    accountType: "Investment",
    balance: 45000.0,
    status: "active",
    totalAccounts: 3,
    totalDeposited: 50000.0,
    totalWithdrawn: 5000.0,
    totalTransferred: 10000.0,
    totalReceived: 10000.0,
  },
  {
    id: "CUST-004",
    name: "David Brown",
    email: "david@example.com",
    zipCode: "75001",
    accountType: "Checking",
    balance: 1250.25,
    status: "inactive",
    totalAccounts: 1,
    totalDeposited: 5000.0,
    totalWithdrawn: 3749.75,
    totalTransferred: 500.0,
    totalReceived: 500.0,
  },
  {
    id: "CUST-005",
    name: "Elizabeth Davis",
    email: "elizabeth@example.com",
    zipCode: "20001",
    accountType: "Savings",
    balance: 8500.0,
    status: "active",
    totalAccounts: 2,
    totalDeposited: 10000.0,
    totalWithdrawn: 1500.0,
    totalTransferred: 2000.0,
    totalReceived: 2000.0,
  },
  {
    id: "CUST-006",
    name: "Frank Miller",
    email: "frank@example.com",
    zipCode: "33101",
    accountType: "Investment",
    balance: 67500.5,
    status: "active",
    totalAccounts: 2,
    totalDeposited: 70000.0,
    totalWithdrawn: 2499.5,
    totalTransferred: 5000.0,
    totalReceived: 5000.0,
  },
  {
    id: "CUST-007",
    name: "Grace Wilson",
    email: "grace@example.com",
    zipCode: "10001",
    accountType: "Checking",
    balance: 3200.75,
    status: "pending",
    totalAccounts: 1,
    totalDeposited: 5000.0,
    totalWithdrawn: 1799.25,
    totalTransferred: 1000.0,
    totalReceived: 1000.0,
  },
  {
    id: "CUST-008",
    name: "Henry Taylor",
    email: "henry@example.com",
    zipCode: "90210",
    accountType: "Savings",
    balance: 15750.25,
    status: "active",
    totalAccounts: 2,
    totalDeposited: 20000.0,
    totalWithdrawn: 4249.75,
    totalTransferred: 3000.0,
    totalReceived: 3000.0,
  },
  {
    id: "CUST-009",
    name: "Irene Moore",
    email: "irene@example.com",
    zipCode: "60601",
    accountType: "Investment",
    balance: 125000.0,
    status: "active",
    totalAccounts: 3,
    totalDeposited: 150000.0,
    totalWithdrawn: 25000.0,
    totalTransferred: 15000.0,
    totalReceived: 15000.0,
  },
  {
    id: "CUST-010",
    name: "Jack Anderson",
    email: "jack@example.com",
    zipCode: "75001",
    accountType: "Checking",
    balance: 950.5,
    status: "inactive",
    totalAccounts: 1,
    totalDeposited: 3000.0,
    totalWithdrawn: 2049.5,
    totalTransferred: 500.0,
    totalReceived: 500.0,
  },
  {
    id: "CUST-011",
    name: "Katherine Lewis",
    email: "katherine@example.com",
    zipCode: "20001",
    accountType: "Savings",
    balance: 22500.0,
    status: "active",
    totalAccounts: 2,
    totalDeposited: 25000.0,
    totalWithdrawn: 2500.0,
    totalTransferred: 4000.0,
    totalReceived: 4000.0,
  },
  {
    id: "CUST-012",
    name: "Leonard Martin",
    email: "leonard@example.com",
    zipCode: "33101",
    accountType: "Investment",
    balance: 85000.25,
    status: "active",
    totalAccounts: 2,
    totalDeposited: 90000.0,
    totalWithdrawn: 4999.75,
    totalTransferred: 7500.0,
    totalReceived: 7500.0,
  },
  {
    id: "CUST-013",
    name: "Mia Rodriguez",
    email: "mia@example.com",
    zipCode: "10001",
    accountType: "Checking",
    balance: 4250.75,
    status: "active",
    totalAccounts: 1,
    totalDeposited: 7500.0,
    totalWithdrawn: 3249.25,
    totalTransferred: 1500.0,
    totalReceived: 1500.0,
  },
  {
    id: "CUST-014",
    name: "Nathan Young",
    email: "nathan@example.com",
    zipCode: "90210",
    accountType: "Savings",
    balance: 18500.5,
    status: "pending",
    totalAccounts: 2,
    totalDeposited: 20000.0,
    totalWithdrawn: 1499.5,
    totalTransferred: 3000.0,
    totalReceived: 3000.0,
  },
  {
    id: "CUST-015",
    name: "Olivia White",
    email: "olivia@example.com",
    zipCode: "60601",
    accountType: "Investment",
    balance: 150000.0,
    status: "active",
    totalAccounts: 3,
    totalDeposited: 175000.0,
    totalWithdrawn: 25000.0,
    totalTransferred: 20000.0,
    totalReceived: 20000.0,
  },
  {
    id: "CUST-016",
    name: "Patrick Garcia",
    email: "patrick@example.com",
    zipCode: "75001",
    accountType: "Checking",
    balance: 2750.0,
    status: "active",
    totalAccounts: 1,
    totalDeposited: 5000.0,
    totalWithdrawn: 2250.0,
    totalTransferred: 750.0,
    totalReceived: 750.0,
  },
  {
    id: "CUST-017",
    name: "Quinn Thompson",
    email: "quinn@example.com",
    zipCode: "20001",
    accountType: "Savings",
    balance: 9800.0,
    status: "active",
    totalAccounts: 2,
    totalDeposited: 12000.0,
    totalWithdrawn: 2200.0,
    totalTransferred: 1500.0,
    totalReceived: 1500.0,
  },
  {
    id: "CUST-018",
    name: "Rachel Martinez",
    email: "rachel@example.com",
    zipCode: "33101",
    accountType: "Investment",
    balance: 78500.0,
    status: "active",
    totalAccounts: 2,
    totalDeposited: 85000.0,
    totalWithdrawn: 6500.0,
    totalTransferred: 8000.0,
    totalReceived: 8000.0,
  },
  {
    id: "CUST-019",
    name: "Samuel Parker",
    email: "samuel@example.com",
    zipCode: "10001",
    accountType: "Checking",
    balance: 3750.25,
    status: "inactive",
    totalAccounts: 1,
    totalDeposited: 6000.0,
    totalWithdrawn: 2249.75,
    totalTransferred: 1000.0,
    totalReceived: 1000.0,
  },
  {
    id: "CUST-020",
    name: "Tiffany Collins",
    email: "tiffany@example.com",
    zipCode: "90210",
    accountType: "Savings",
    balance: 16250.75,
    status: "active",
    totalAccounts: 2,
    totalDeposited: 18000.0,
    totalWithdrawn: 1749.25,
    totalTransferred: 2500.0,
    totalReceived: 2500.0,
  },
]

// Redefine the columns array with the new columns in the specified order
const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Full Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "zipCode",
    header: "Zip Code",
    cell: ({ row }) => <div>{row.getValue("zipCode")}</div>,
  },
  {
    accessorKey: "totalAccounts",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Total Accounts
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="text-center">{row.getValue("totalAccounts")}</div>,
  },
  {
    accessorKey: "balance",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Total Balance
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("balance"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "totalDeposited",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Total Deposited
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("totalDeposited"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)

      return <div className="text-right">{formatted}</div>
    },
  },
  {
    accessorKey: "totalWithdrawn",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Total Withdrawn
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("totalWithdrawn"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)

      return <div className="text-right">{formatted}</div>
    },
  },
  {
    accessorKey: "totalTransferred",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Total Transferred
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("totalTransferred"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)

      return <div className="text-right">{formatted}</div>
    },
  },
  {
    accessorKey: "totalReceived",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Total Received
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("totalReceived"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)

      return <div className="text-right">{formatted}</div>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const customer = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(customer.id)}>
              Copy customer ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer details</DropdownMenuItem>
            <DropdownMenuItem>Edit customer</DropdownMenuItem>
            <DropdownMenuItem>View transaction history</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function CustomerDatabaseTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [balanceRange, setBalanceRange] = useState([0, 150000])
  const [selectedZipCode, setSelectedZipCode] = useState<string>("")
  const [selectedAccountType, setSelectedAccountType] = useState<string>("")
  const [selectedStatus, setSelectedStatus] = useState<string>("")
  const [reportType, setReportType] = useState("summary")

  // Get unique zip codes for the filter dropdown
  const uniqueZipCodes = Array.from(new Set(data.map((customer) => customer.zipCode)))

  // Define a custom filter function for the balance range
  const balanceRangeFilterFn: FilterFn<Customer> = (row, columnId, value: [number, number]) => {
    const balance = row.getValue(columnId) as number
    return balance >= value[0] && balance <= value[1]
  }

  // Apply advanced filters
  const applyAdvancedFilters = () => {
    // Clear existing filters first
    const newColumnFilters: ColumnFiltersState = []

    if (selectedZipCode && selectedZipCode !== "all") {
      newColumnFilters.push({
        id: "zipCode",
        value: selectedZipCode,
      })
    }

    if (selectedAccountType && selectedAccountType !== "all") {
      newColumnFilters.push({
        id: "accountType",
        value: selectedAccountType,
      })
    }

    if (selectedStatus && selectedStatus !== "all") {
      newColumnFilters.push({
        id: "status",
        value: selectedStatus,
      })
    }

    // Apply balance range filter
    if (balanceRange[0] > 0 || balanceRange[1] < 150000) {
      newColumnFilters.push({
        id: "balance",
        value: balanceRange,
      })
    }

    setColumnFilters(newColumnFilters)
  }

  // Reset all filters
  const resetFilters = () => {
    setSelectedZipCode("")
    setSelectedAccountType("")
    setSelectedStatus("")
    setBalanceRange([0, 150000])
    setColumnFilters([])
  }

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    filterFns: {
      balanceRange: balanceRangeFilterFn,
    },
  })

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search by name..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
            className="max-w-sm"
          />
          <Button variant="outline" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
            <Search className="mr-2 h-4 w-4" />
            {showAdvancedFilters ? "Hide Filters" : "Advanced Filters"}
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Generate Customer Report</DialogTitle>
                <DialogDescription>Create a report based on the current filtered customer data.</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Tabs defaultValue="summary" value={reportType} onValueChange={setReportType}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                    <TabsTrigger value="detailed">Detailed</TabsTrigger>
                    <TabsTrigger value="custom">Custom</TabsTrigger>
                  </TabsList>
                  <TabsContent value="summary" className="mt-4 space-y-4">
                    <p className="text-sm text-muted-foreground">
                      A summary report includes high-level statistics about the customer data.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="summary-count" defaultChecked />
                        <Label htmlFor="summary-count">Customer count by account type</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="summary-balance" defaultChecked />
                        <Label htmlFor="summary-balance">Average balance by account type</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="summary-status" defaultChecked />
                        <Label htmlFor="summary-status">Status distribution</Label>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="detailed" className="mt-4 space-y-4">
                    <p className="text-sm text-muted-foreground">
                      A detailed report includes all customer information in the current filter.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="detailed-all" defaultChecked />
                        <Label htmlFor="detailed-all">Include all customer details</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="detailed-balance" defaultChecked />
                        <Label htmlFor="detailed-balance">Include balance history</Label>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="custom" className="mt-4 space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Select specific fields to include in your custom report.
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {columns
                        .filter((col) => col.id !== "actions")
                        .map((column) => (
                          <div key={column.id} className="flex items-center space-x-2">
                            <Checkbox id={`custom-${column.id}`} defaultChecked />
                            <Label htmlFor={`custom-${column.id}`} className="capitalize">
                              {column.id}
                            </Label>
                          </div>
                        ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              <DialogFooter>
                <Button variant="outline" className="mr-auto">
                  Cancel
                </Button>
                <Select defaultValue="pdf">
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => {
                    // This would be where you generate the actual report
                    alert(`Generating ${reportType} report with ${table.getFilteredRowModel().rows.length} customers`)
                  }}
                >
                  Generate
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {showAdvancedFilters && (
        <div className="rounded-md border p-4 space-y-4">
          <h3 className="font-medium">Advanced Filters</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="zip-code">Zip Code</Label>
              <Select value={selectedZipCode} onValueChange={setSelectedZipCode}>
                <SelectTrigger id="zip-code">
                  <SelectValue placeholder="Select zip code" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All zip codes</SelectItem>
                  {uniqueZipCodes.map((zipCode) => (
                    <SelectItem key={zipCode} value={zipCode}>
                      {zipCode}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="account-type">Account Type</Label>
              <Select value={selectedAccountType} onValueChange={setSelectedAccountType}>
                <SelectTrigger id="account-type">
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All account types</SelectItem>
                  <SelectItem value="Checking">Checking</SelectItem>
                  <SelectItem value="Savings">Savings</SelectItem>
                  <SelectItem value="Investment">Investment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Balance Range</Label>
              <div className="pt-2 px-1">
                <Slider
                  defaultValue={[0, 150000]}
                  max={150000}
                  step={1000}
                  value={balanceRange}
                  onValueChange={setBalanceRange}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                <span>${balanceRange[0].toLocaleString()}</span>
                <span>${balanceRange[1].toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={resetFilters}>
              Reset
            </Button>
            <Button onClick={applyAdvancedFilters}>Apply Filters</Button>
          </div>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} of {data.length} row(s) displayed.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
