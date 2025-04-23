"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRightLeft, Send, Plus, X, Loader2, DollarSign, BanknoteIcon, CheckIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { transferToAccount, transferToSelf, deposit_check } from "../utils/api"
import { AccountDropdown } from "./account-dropdown"
import { toast } from "sonner"

export function QuickActions({ accounts, fetchAccounts }) {
  const [popupType, setPopupType] = useState(null)
  const [amount, setAmount] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [file, setFile] = useState(null)
  const [uploadCheckText, setUploadCheckText] = useState("Choose a file")
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [destinationAccount, setDestinationAccount] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch accounts
  useEffect(() => {
    update()
  }, [])

  const update = async () => {
    try {
      if (selectedAccount) {
        const updatedAccount = accounts.find((acc) => acc.id === selectedAccount.id)
        if (updatedAccount) {
          setSelectedAccount(updatedAccount)
        }
      } else if (accounts.length > 0) {
        setSelectedAccount(accounts[0])
      }
    } catch (error) {
      console.error("Fetch error:", error)
      toast("Failed to load accounts. Please try again.")
    }
  }

  const displayTransactionResult = async (resp) => {
    try {
      const message = await resp
      toast(message)
      return true
    } catch (error) {
      console.error(`Error:`, error)
      toast( error.message || "An error occurred during the transaction")
      return false
    }
  }

  const handleTransaction = async (type) => {
    if (!selectedAccount) {
      toast("Please select an account")
      return
    }

    const numAmount = Number.parseFloat(amount)
    if ((isNaN(numAmount) || numAmount <= 0) && type !== "check") {
      toast("Please enter a valid amount")
      return
    }

    setIsLoading(true)
    let result = null

    try {
      if (type === "send") {
        if (!accountNumber) {
          throw new Error("Please enter a recipient account number")
        }
        result = transferToAccount(selectedAccount.id, Number(accountNumber), numAmount)
      } else if (type === "transfer") {
        if (!destinationAccount) {
          throw new Error("Please select a destination account")
        }
        result = transferToSelf(selectedAccount.id, destinationAccount.account_number, numAmount)
      } else if (type === "check") {
        if (!file) {
          throw new Error("Please upload a check image")
        }
        const formData = new FormData()
        formData.append("check_image", file)
        result = deposit_check(selectedAccount.id, formData)
      }

      const success = await displayTransactionResult(result)

      if (success) {
        // Reset form
        setAmount("")
        setAccountNumber("")
        setFile(null)
        setUploadCheckText("Choose a file")
        setDestinationAccount(null)
        setPopupType(null)
        fetchAccounts()
      }
    } catch (error) {
      toast(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0])
      setUploadCheckText(e.target.files[0].name)
    }
  }

  // Get the appropriate icon for the transaction type
  const getTransactionIcon = (type) => {
    switch (type) {
      case "send":
        return <Send className="h-6 w-6 text-blue-500" />
      case "transfer":
        return <ArrowRightLeft className="h-6 w-6 text-purple-500" />
      case "check":
        return <BanknoteIcon className="h-6 w-6 text-green-500" />
      default:
        return <DollarSign className="h-6 w-6" />
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common banking tasks</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button className="w-full justify-start" variant="outline" onClick={() => setPopupType("send")}>
            <Send className="mr-2 h-4 w-4" />
            Send Money
          </Button>
          <Button className="w-full justify-start" variant="outline" onClick={() => setPopupType("transfer")}>
            <ArrowRightLeft className="mr-2 h-4 w-4" />
            Transfer Between Accounts
          </Button>
          <Button className="w-full justify-start" variant="outline" onClick={() => setPopupType("check")}>
            <Plus className="mr-2 h-4 w-4" />
            Upload Check
          </Button>
        </CardContent>
      </Card>

      {popupType && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* Header */}
            <div className="flex items-center p-5 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                {getTransactionIcon(popupType)}
                <h3 className="text-xl font-semibold">
                  {popupType === "send" && "Send Money"}
                  {popupType === "transfer" && "Transfer Between Accounts"}
                  {popupType === "check" && "Upload Check"}
                </h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPopupType(null)}
                className="ml-auto h-8 w-8 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
              {/* Source Account Selection */}
              <div className="space-y-2">
                <Label htmlFor="source-account" className="text-sm font-medium text-gray-700">
                  From Account
                </Label>
                <AccountDropdown accounts={accounts} selectedAccount={selectedAccount} onChange={setSelectedAccount} />
              </div>

              {(popupType === "send" || popupType === "transfer") && (
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
                    Amount
                  </Label>
                  <div className="relative">
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-10 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Recipient Account Number */}
              {popupType === "send" && (
                <div className="space-y-2">
                  <Label htmlFor="recipient" className="text-sm font-medium text-gray-700">
                    Recipient Account Number
                  </Label>
                  <Input
                    id="recipient"
                    placeholder="Enter recipient's account number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              {/* Destination Account */}
              {popupType === "transfer" && (
                <div className="space-y-2">
                  <Label htmlFor="destination" className="text-sm font-medium text-gray-700">
                    To Account
                  </Label>
                  <AccountDropdown
                    accounts={accounts.filter((acc) => acc.id !== selectedAccount?.id)}
                    selectedAccount={destinationAccount}
                    onChange={setDestinationAccount}
                  />
                </div>
              )}

              {/* Check Upload */}
              {popupType === "check" && (
                <div className="space-y-2">
                  <Label htmlFor="check-upload" className="text-sm font-medium text-gray-700">
                    Upload Check Image
                  </Label>
                  <div className="relative">
                    <input
                      id="check-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                    />
                    <div className="w-full h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors p-3">
                      <Plus className="h-6 w-6 text-gray-400 mb-1" />
                      <span className="text-sm text-gray-600 truncate max-w-full px-4">{uploadCheckText}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-5 border-t border-gray-100 bg-gray-50">
              <Button
                variant="outline"
                onClick={() => setPopupType(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleTransaction(popupType)}
                disabled={
                  isLoading ||
                  !selectedAccount ||
                  (popupType === "check" && !file) ||
                  ((popupType === "send" || popupType === "transfer") &&
                    (isNaN(Number.parseFloat(amount)) ||
                      Number.parseFloat(amount) <= 0 ||
                      (popupType === "send" && !accountNumber) ||
                      (popupType === "transfer" && !destinationAccount)))
                }
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckIcon className="mr-2 h-4 w-4" />
                    Confirm
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
