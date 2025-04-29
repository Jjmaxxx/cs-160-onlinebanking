"use client"
import { useState, useEffect } from "react"
import Navbar from "../components/Navbar"
import { AccountDropdown } from "../components/account-dropdown.jsx"

export default function BillManager() {
  const [accounts, setAccounts] = useState([])
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [bills, setBills] = useState([])
  const [billName, setBillName] = useState("")
  const [billAmount, setBillAmount] = useState("")
  const [billDueDate, setBillDueDate] = useState("")
  const [destAccountNum, setDestAccountNum] = useState("")
  const [errors, setErrors] = useState({ destAccountNum: "" })
  const [billStatus, setBillStatus] = useState("pending") // New state for bill status filter

  const [trigger, setTrigger] = useState(0)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/accounts`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        setAccounts(data.accounts)
        if (!selectedAccount && data.accounts.length > 0) {
          setSelectedAccount(data.accounts[0])
        }
      })
  }, [])

  useEffect(() => {
    if (selectedAccount) {
      // Updated URL to include status parameter
      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/accounts/get_bill_payments?account_id=${selectedAccount.id}&status=${billStatus}`,
        {
          method: "GET",
          credentials: "include",
        },
      )
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setBills(data)
          } else {
            setBills([])
          }
        })
    }
  }, [selectedAccount, trigger, billStatus]) // Added billStatus as a dependency

  const handleAddBill = () => {
    // Reset errors
    setErrors({ destAccountNum: "" })

    // Validate destination account number
    if (!destAccountNum.trim()) {
      setErrors({ destAccountNum: "Destination account number is required" })
      return
    }

    if (!selectedAccount || !billName || !billAmount || !billDueDate) return

    const dueTimestamp = Math.floor(new Date(billDueDate).getTime() / 1000)

    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/accounts/register_bill_payment`)
    url.searchParams.append("account_id", selectedAccount.id)
    url.searchParams.append("bill_name", billName)
    url.searchParams.append("amount", Number.parseFloat(billAmount))
    url.searchParams.append("due_date", dueTimestamp)
    url.searchParams.append("dest_account_num", destAccountNum)

    fetch(url, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message || "Bill added")
        setBillName("")
        setBillAmount("")
        setBillDueDate("")
        setDestAccountNum("")
        setTrigger(trigger + 1)
      })
      .catch((err) => console.error("Add bill error:", err))
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
        <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-xl mb-10 flex flex-col space-y-4">
          <h2 className="text-2xl font-bold text-center">Bill Payments</h2>

          <AccountDropdown accounts={accounts} selectedAccount={selectedAccount} onChange={setSelectedAccount} />

          <div>
            <label className="block font-semibold mb-1">Bill Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded"
              value={billName}
              onChange={(e) => setBillName(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Amount ($)</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded"
              value={billAmount}
              onChange={(e) => setBillAmount(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Due Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded"
              value={billDueDate}
              onChange={(e) => setBillDueDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Destination Account Number</label>
            <input
              type="text"
              className={`w-full px-3 py-2 border rounded ${errors.destAccountNum ? "border-red-500" : ""}`}
              value={destAccountNum}
              onChange={(e) => setDestAccountNum(e.target.value)}
              placeholder="Enter destination account number"
              required
            />
            {errors.destAccountNum && <p className="text-red-500 text-sm mt-1">{errors.destAccountNum}</p>}
          </div>

          <button className="bg-blue-500 text-white rounded-lg hover:bg-blue-600 py-2 px-4" onClick={handleAddBill}>
            Add Bill
          </button>
        </div>

        <div className="mt-10 bg-white shadow-md rounded-xl p-6 w-full max-w-xl">
          <h3 className="text-xl font-semibold mb-4 text-center">Scheduled Bills</h3>

          {/* Status selector tabs */}
          <div className="flex border-b mb-4">
            {["pending", "completed", "failed"].map((status) => (
              <button
                key={status}
                className={`px-4 py-2 capitalize ${
                  billStatus === status
                    ? "border-b-2 border-blue-500 text-blue-500 font-medium"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setBillStatus(status)}
              >
                {status}
              </button>
            ))}
          </div>

          {bills.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {bills.map((bill, index) => (
                <li key={index} className="py-2 flex justify-between">
                  <span>{bill.payee_name}</span>
                  <span>${bill.amount}</span>
                  <span>{new Date(bill.payment_date).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">No {billStatus} bills found.</p>
          )}
        </div>
      </div>
    </>
  )
}
