"use client"

import { useState } from "react"
import { Download, FileDown, Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { CustomerDistributionChart } from "@/components/customer-distribution-chart"
import { BalanceDistributionChart } from "@/components/balance-distribution-chart"

export function ReportGenerator() {
  const [zipCodes, setZipCodes] = useState<string[]>([])
  const [balanceRange, setBalanceRange] = useState([0, 100000])
  const [accountTypes, setAccountTypes] = useState<string[]>([])
  const [reportType, setReportType] = useState("customer-distribution")

  const handleZipCodeChange = (zipCode: string) => {
    setZipCodes((prev) => (prev.includes(zipCode) ? prev.filter((z) => z !== zipCode) : [...prev, zipCode]))
  }

  const handleAccountTypeChange = (accountType: string) => {
    setAccountTypes((prev) =>
      prev.includes(accountType) ? prev.filter((a) => a !== accountType) : [...prev, accountType],
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-sm font-medium">Zip Codes</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="zipcode-10001"
                  checked={zipCodes.includes("10001")}
                  onCheckedChange={() => handleZipCodeChange("10001")}
                />
                <Label htmlFor="zipcode-10001">10001 (New York)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="zipcode-90210"
                  checked={zipCodes.includes("90210")}
                  onCheckedChange={() => handleZipCodeChange("90210")}
                />
                <Label htmlFor="zipcode-90210">90210 (Beverly Hills)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="zipcode-60601"
                  checked={zipCodes.includes("60601")}
                  onCheckedChange={() => handleZipCodeChange("60601")}
                />
                <Label htmlFor="zipcode-60601">60601 (Chicago)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="zipcode-75001"
                  checked={zipCodes.includes("75001")}
                  onCheckedChange={() => handleZipCodeChange("75001")}
                />
                <Label htmlFor="zipcode-75001">75001 (Dallas)</Label>
              </div>
            </div>
          </div>
          <Separator />
          <div>
            <h3 className="mb-2 text-sm font-medium">Account Types</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="account-checking"
                  checked={accountTypes.includes("Checking")}
                  onCheckedChange={() => handleAccountTypeChange("Checking")}
                />
                <Label htmlFor="account-checking">Checking</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="account-savings"
                  checked={accountTypes.includes("Savings")}
                  onCheckedChange={() => handleAccountTypeChange("Savings")}
                />
                <Label htmlFor="account-savings">Savings</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="account-investment"
                  checked={accountTypes.includes("Investment")}
                  onCheckedChange={() => handleAccountTypeChange("Investment")}
                />
                <Label htmlFor="account-investment">Investment</Label>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-sm font-medium">Balance Range</h3>
            <div className="space-y-6 pt-4">
              <Slider
                defaultValue={[0, 100000]}
                max={150000}
                step={1000}
                value={balanceRange}
                onValueChange={setBalanceRange}
              />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">${balanceRange[0].toLocaleString()}</span>
                <span className="text-sm text-muted-foreground">${balanceRange[1].toLocaleString()}</span>
              </div>
            </div>
          </div>
          <Separator />
          <div>
            <h3 className="mb-2 text-sm font-medium">Report Type</h3>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer-distribution">Customer Distribution</SelectItem>
                <SelectItem value="balance-distribution">Balance Distribution</SelectItem>
                <SelectItem value="account-types">Account Types</SelectItem>
                <SelectItem value="transaction-volume">Transaction Volume</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-sm font-medium">Report Actions</h3>
            <div className="space-y-2">
              <Button className="w-full" onClick={() => {}}>
                <Filter className="mr-2 h-4 w-4" />
                Apply Filters
              </Button>
              <Button variant="outline" className="w-full" onClick={() => {}}>
                <FileDown className="mr-2 h-4 w-4" />
                Export as CSV
              </Button>
              <Button variant="outline" className="w-full" onClick={() => {}}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          {reportType === "customer-distribution" ? <CustomerDistributionChart /> : <BalanceDistributionChart />}
        </CardContent>
      </Card>
    </div>
  )
}
