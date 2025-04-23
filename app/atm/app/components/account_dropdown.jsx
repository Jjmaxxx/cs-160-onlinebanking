"use client"

import { Check, ChevronDown } from "lucide-react"
import { useState } from "react"

export default function AccountDropdown({ accounts, selectedAccount, onChange }) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (account) => {
    onChange(account)
    setIsOpen(false)
  }

  const formatAccountNumber = (number) => {
    return `•••• ${String(number).slice(-4)}`
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  if (!accounts || accounts.length === 0) {
    return <div className="text-gray-500 p-4 text-center">No accounts available</div>
  }

  return (
    <div className="relative mb-4">
      <button
        type="button"
        className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedAccount ? (
          <div className="flex flex-col items-start">
            <span className="font-medium text-gray-900">{String(selectedAccount.account_type).toUpperCase()}</span>
            <span className="text-sm text-gray-500">
              {formatAccountNumber(selectedAccount.account_number)} • {formatCurrency(selectedAccount.balance)}
            </span>
          </div>
        ) : (
          <span className="text-gray-500">Select an account</span>
        )}
        <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
          <ul className="py-1 max-h-60 overflow-auto">
            {accounts.map((account) => (
              <li key={account.id}>
                <button
                  type="button"
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center justify-between ${
                    selectedAccount?.id === account.id ? "bg-gray-50" : ""
                  }`}
                  onClick={() => handleSelect(account)}
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{String(account.account_type).toUpperCase()}</span>
                    <span className="text-sm text-gray-500">
                      {formatAccountNumber(account.account_number)} • {formatCurrency(account.balance)}
                    </span>
                  </div>
                  {selectedAccount?.id === account.id && <Check className="h-5 w-5 text-green-500" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
