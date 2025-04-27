"use client"

import { useState, useEffect } from "react"
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
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, Download, MoreHorizontal, Search } from "lucide-react"

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
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

// Define the customer data type
type Customer = {
  id: string
  name: string
  email: string
  zipCode: string
  accountType: string
  balance: number
  status: "active" | "inactive" | "pending"
}

// Define the report data type


// Define the columns for the table
const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "id",
    header: "Customer ID",
    cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "zipCode",
    header: "Zip Code",
    cell: ({ row }) => <div>{row.getValue("zipCode")}</div>,
  },
  {
    accessorKey: "accountType",
    header: "Account Type",
    cell: ({ row }) => <div>{row.getValue("accountType")}</div>,
  },
  {
    accessorKey: "balance",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Balance
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

      return <div className="text-left font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string

      return (
        <Badge variant={status === "active" ? "default" : status === "pending" ? "outline" : "secondary"}>
          {status}
        </Badge>
      )
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

export function CustomerTable() {
  // CUSTOMER TABLE
  const [data, setData] = useState<Customer[]>([])

  // Grabs all accounts and pairs them with their corresponding user
  useEffect(() => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/bank_manager/all_user_accounts`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.json())
        .then((d) => {

          /*  Convert key zip_code to ZipCode, merge first_name and last_name into name, change account_type to accountType, 
              capitalize accountType value, change account_status to status, and set id to string "CUST-<account_number>",
              and set balance to number.
          */
          const transformedData = d.map((customer: any) => ({
            id: `CUST-${customer.id}`,
            name: `${customer.first_name} ${customer.last_name}`,
            email: customer.email,
            zipCode: customer.zip_code,
            accountType: customer.account_type.charAt(0).toUpperCase() + customer.account_type.slice(1),
            balance: Number(customer.balance),
            status: customer.account_status
          }));
          setData(transformedData);
          console.log(transformedData)

        })
        .catch((error) => console.error("Fetch error:", error));
    }, []);

  



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

  // Apply advanced filters
  const applyAdvancedFilters = () => {
    // Clear existing filters first
    const newColumnFilters: ColumnFiltersState = []

    if (selectedZipCode) {
      newColumnFilters.push({
        id: "zipCode",
        value: selectedZipCode,
      })
    }

    if (selectedAccountType) {
      newColumnFilters.push({
        id: "accountType",
        value: selectedAccountType,
      })
    }

    if (selectedStatus) {
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
      // Custom filter function for balance range
      balanceRange: (row, id, value: [number, number]) => {
        const balance = row.getValue(id) as number
        return balance >= value[0] && balance <= value[1]
      },
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
