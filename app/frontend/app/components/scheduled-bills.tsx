"use client"

import { useState, useEffect } from "react"
import { Calendar, ChevronDown, ChevronUp, ChevronRight } from "lucide-react"

export function ScheduledBills() {
  const [bills, setBills] = useState([])
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/get_all_bill_payments`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        if(!data.error){
          setBills(data.reverse())
        }
      })
  }, [])

  const displayedBills = isExpanded ? bills.slice(0, 6) : bills.slice(0, 3)
  const showButton = bills.length > 3

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-xl border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Scheduled Bills</h3>
        <a
          href="/billpayment"
          className="px-3 py-1.5 text-sm rounded-md font-medium flex items-center gap-1"
        >
          <span>Setup Payments</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </a>
      </div>

      {bills.length > 0 ? (
        <>
          <ul className="divide-y divide-gray-200">
            {displayedBills.map((bill, index) => (
              <li key={index} className="py-3 hover:bg-gray-50 rounded-md px-2 transition-colors">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800">{bill.payee_name}</span>
                    <div className="flex flex-col text-sm text-gray-500">
                      <span>
                        On{" "}
                        {new Date(bill.payment_date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                      <span>From Account: •••• {bill.account_number.toString().slice(-4)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-emerald-600">${Number(bill.amount).toFixed(2)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {showButton && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-4 w-full py-2 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
            >
              {isExpanded ? (
                <>
                  <span>Show Less</span>
                  <ChevronUp className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  <span>Show More</span>
                  <ChevronDown className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          )}
        </>
      ) : (
        <div className="py-8 text-center">
          <Calendar className="mx-auto h-10 w-10 text-gray-400 mb-2" />
          <p className="text-gray-500">No bills scheduled.</p>
        </div>
      )}
    </div>
  )
}
