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
import { join } from "path"
import { CardDescription, CardHeader, CardTitle } from "./ui/card"

// Define the report batch data type
type ReportBatch = {
  id: string
  bank_manager_id: string
  email: string
  date: string
}

// Define the report data type
type UserReport = {
    user_id: number;
    full_name: string;
    total_accounts: number;
    total_balance: string;
    total_money_deposited: string;
    total_money_received: string;
    total_money_transferred: string;
    total_money_withdrawn: string;
    total_transactions: number;
}

// Define the report batch columns for the table
const reportBatchColumn: ColumnDef<ReportBatch>[] = [
  {
    accessorKey: "id",
    header: "Report Batch ID",
    cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "bank_manager_id",
    header: "Bank Manager ID",
    cell: ({ row }) => <div>{row.getValue("bank_manager_id")}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
];

// Define the user report columns for the table
const userReportColumn: ColumnDef<UserReport>[] = [
  {
    accessorKey: "user_id",
    header: "User ID",
    cell: ({ row }) => <div className="font-medium">{row.getValue("user_id")}</div>,
  },
  {
    accessorKey: "full_name",
    header: "Full Name",
    cell: ({ row }) => <div>{row.getValue("full_name")}</div>,
  },
  {
    accessorKey: "total_accounts",
    header: "Total Accounts",
    cell: ({ row }) => <div>{row.getValue("total_accounts")}</div>,
  },
  {
    accessorKey: "total_balance",
    header: "Total Balance",
    cell: ({ row }) => <div>{row.getValue("total_balance")}</div>,
  },
  {
    accessorKey: "total_money_deposited",
    header: "Total Money Deposited",
    cell: ({ row }) => <div>{row.getValue("total_money_deposited")}</div>,
  },
  {
    accessorKey: "total_money_received",
    header: "Total Money Received",
    cell: ({ row }) => <div>{row.getValue("total_money_received")}</div>,
  },
  {
    accessorKey: "total_money_transferred",
    header: "Total Money Transferred",
    cell: ({ row }) => <div>{row.getValue("total_money_transferred")}</div>,
  },
  {
    accessorKey: "total_money_withdrawn",
    header: "Total Money Withdrawn",
    cell: ({ row }) => <div>{row.getValue("total_money_withdrawn")}</div>,
  },
  {
    accessorKey: "total_transactions",
    header: "Total Transactions",
    cell: ({ row }) => <div>{row.getValue("total_transactions")}</div>,
  },
]

export function ReportGenerator() {
  // TABLE
  const [reportBatches, setReportBatches] = useState<ReportBatch[]>([]);
  const [userReports, setUserReports] = useState<UserReport[]>([]);
  const [selectedReportBatch, setSelectedReportBatch] = useState<ReportBatch | null>(null);
  const [trigger, setTrigger] = useState(0);
  const [triggerCurrentReport, setTriggerCurrentReport] = useState(0);

  // Grabs the specfic user report batch
  const reportBatchHandler = (id: string) => {
    
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/bank_manager/user_reports_batch?batch_id=${id}`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)

        // Fill data to userReports
        const transformedData = data.user_reports.map((report: any) => ({
          user_id: report.user_id,
          full_name: report.full_name,
          total_accounts: report.total_accounts,
          total_balance: report.total_balance,
          total_money_deposited: report.total_money_deposited,
          total_money_received: report.total_money_received,
          total_money_transferred: report.total_money_transferred,
          total_money_withdrawn: report.total_money_withdrawn,
          total_transactions: report.total_transactions,
        }));
        setUserReports(transformedData);
      })
      .catch((error) => console.error("Fetch error:", error))

      setSelectedReportBatch(reportBatches.find((batch) => batch.id === id) || null);
  }

  // Function to generate a new report
  const generateNewReportHandler = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/bank_manager/generate_report`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
        .then((response) => response.json())
        .then((data) => {
            reportBatchHandler(data.batch_id); // Fetch the new report batch after generating it

            setTrigger((prev) => prev + 1); // Trigger a re-fetch of all report batches
    })
    .catch((error) => console.error("Fetch error:", error));
  }

  // Shows current report batch
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/bank_manager/generate_report_display`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
        .then((response) => response.json())
        .then((data) => {
            

            // Fill data to userReports
            const transformedData = data.user_reports.map((report: any) => ({
              user_id: report.id,
              full_name: report.full_name,
              total_accounts: report.total_accounts,
              total_balance: report.total_balance,
              total_money_deposited: report.total_money_deposited,
              total_money_received: report.total_money_received,
              total_money_transferred: report.total_money_transferred,
              total_money_withdrawn: report.total_money_withdrawn,
              total_transactions: report.total_transactions,
            }));
            
            console.log(transformedData);

            setUserReports(transformedData);
    })
    .catch((error) => console.error("Fetch error:", error));


    setSelectedReportBatch(null); // Reset selected report batch when generating a new report
  }, [triggerCurrentReport]);

  // Grabs all reports
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/bank_manager/all_report_batches`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((d) => {

        const transformedData = d.map((report: any) => ({
          id: report.batch_id,
          bank_manager_id: report.bank_manager_id,
          email: report.email,
          date: report.batch_created_at,
        }));
        setReportBatches(transformedData);

      })
      .catch((error) => console.error("Fetch error:", error));
  }, [trigger, triggerCurrentReport]);



  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [balanceRange, setBalanceRange] = useState([0, 150000])
  const [selectedZipCode, setSelectedZipCode] = useState<string>("")
  const [selectedAccountType, setSelectedAccountType] = useState<string>("")
  const [selectedStatus, setSelectedStatus] = useState<string>("")


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

  const reportBatchTable = useReactTable({
    data: reportBatches,
    columns: reportBatchColumn,
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

  const userReportTable = useReactTable({
    data: userReports,
    columns: userReportColumn,
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
  })

  return (
    <div className="w-full space-y-4">
      {/* Line separator */}
      <div className="border-b border-gray-200" />

      {/* REPORT BATCHES */}
      <CardHeader>
        <CardTitle>Report Batch</CardTitle>
        <CardDescription>
          Select a report batch to view user reports.
        </CardDescription>
      </CardHeader>

      {/* Search and filter options */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
          Columns <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {reportBatchTable
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
        <div className="flex items-center gap-2">
        <Button
          variant="default"
          className="bg-black text-white"
          onClick={generateNewReportHandler}
        >
          Generate New Report
        </Button>
        <Button variant="outline">
        <Download className="mr-2 h-4 w-4" />
        Export All
        </Button>
      </div>
      </div>

      {/* Report Batch Table */}
      <div className="rounded-md border">
      <Table>
        <TableHeader>
        {reportBatchTable.getHeaderGroups().map((headerGroup) => (
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
        {reportBatchTable.getRowModel().rows?.length ? (
          reportBatchTable.getRowModel().rows.map((row) => (
          <TableRow
            key={row.id}
            data-state={row.getIsSelected() && "selected"}
            className="cursor-pointer"
            onClick={() => reportBatchHandler(row.original.id)}
          >
            {row.getVisibleCells().map((cell) => (
            <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
            ))}
          </TableRow>
          ))
        ) : (
          <TableRow>
          <TableCell colSpan={reportBatchColumn.length} className="h-24 text-center">
            No results.
          </TableCell>
          </TableRow>
        )}
        </TableBody>
      </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
      <div className="flex-1 text-sm text-muted-foreground">
        {reportBatchTable.getFilteredRowModel().rows.length} of {reportBatches.length} row(s) displayed.
      </div>
      <div className="space-x-2">
        <Button
        variant="outline"
        size="sm"
        onClick={() => reportBatchTable.previousPage()}
        disabled={!reportBatchTable.getCanPreviousPage()}
        >
        Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => reportBatchTable.nextPage()} disabled={!reportBatchTable.getCanNextPage()}>
        Next
        </Button>
      </div>
      </div>

      {/* Line separator */}
      <div className="border-b border-gray-200" />


      {/* USER REPORTS */}
      <CardHeader>
        <CardTitle>User Reports</CardTitle>
        <CardDescription>
          User Reports for Report Batch: {selectedReportBatch ? selectedReportBatch.id : "Current"}
        </CardDescription>
      </CardHeader>

      {/* Search and filter options */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
          Columns <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {userReportTable
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
        <div className="flex items-center gap-2">
        <Button
          variant="default"
          className="bg-black text-white"
          onClick={() => setTriggerCurrentReport((prev) => prev + 1)}
        >
          See Current Report
        </Button>
        <Button variant="outline">
        <Download className="mr-2 h-4 w-4" />
        Export
        </Button>
      </div>
      </div>

      {/* User Report Table */}
      <div className="rounded-md border">
      <Table>
        <TableHeader>
        {userReportTable.getHeaderGroups().map((headerGroup) => (
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
        {userReportTable.getRowModel().rows?.length ? (
          userReportTable.getRowModel().rows.map((row) => (
          <TableRow
        key={row.id}
        data-state={row.getIsSelected() && "selected"}
        className="cursor-pointer"
          >
        {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
        ))}
          </TableRow>
          ))
        ) : (
          <TableRow>
          <TableCell colSpan={userReportColumn.length} className="h-24 text-center">
        No results.
          </TableCell>
          </TableRow>
        )}
        </TableBody>
      </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
      <div className="flex-1 text-sm text-muted-foreground">
        {userReportTable.getFilteredRowModel().rows.length} of {userReports.length} row(s) displayed.
      </div>
      <div className="space-x-2">
        <Button
        variant="outline"
        size="sm"
        onClick={() => userReportTable.previousPage()}
        disabled={!userReportTable.getCanPreviousPage()}
        >
        Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => userReportTable.nextPage()} disabled={!userReportTable.getCanNextPage()}>
        Next
        </Button>
      </div>
      </div>
    </div>
  )
}
