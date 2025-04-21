"use client"

import { useState } from "react"
import { FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
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
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CustomerReportDialogProps {
  filteredRowCount: number
  columns: any[]
}

export function CustomerReportDialog({ filteredRowCount, columns }: CustomerReportDialogProps) {
  const [reportType, setReportType] = useState("summary")

  return (
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
              <p className="text-sm text-muted-foreground">Select specific fields to include in your custom report.</p>
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
              alert(`Generating ${reportType} report with ${filteredRowCount} customers`)
            }}
          >
            Generate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
