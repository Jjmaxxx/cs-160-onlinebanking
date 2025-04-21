"use client";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { AccountDropdown } from "../transact/account_dropdown.jsx";

export default function BillManager() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [bills, setBills] = useState([]);
  const [billName, setBillName] = useState("");
  const [billAmount, setBillAmount] = useState("");
  const [billDueDate, setBillDueDate] = useState("");

  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    fetch("http://localhost:12094/user/accounts", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        setAccounts(data.accounts);
        if (!selectedAccount && data.accounts.length > 0) {
          setSelectedAccount(data.accounts[0]);
        }
      });
  }, []);

  useEffect(() => {
    if (selectedAccount) {
      fetch(
        `http://localhost:12094/accounts/get_bill_payments?account_id=${selectedAccount.id}`,
        {
          method: "GET",
          credentials: "include",
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setBills(data);
          } else {
            setBills([]);
          }
        });
    }
  }, [selectedAccount, trigger]);

  const handleAddBill = () => {
    if (!selectedAccount || !billName || !billAmount || !billDueDate) return;

    const dueTimestamp = Math.floor(new Date(billDueDate).getTime() / 1000);

    const url = new URL("http://localhost:12094/accounts/register_bill_payment");
    url.searchParams.append("account_id", selectedAccount.id);
    url.searchParams.append("bill_name", billName);
    url.searchParams.append("amount", parseFloat(billAmount));
    url.searchParams.append("due_date", dueTimestamp);

    fetch(url, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message || "Bill added");
        setBillName("");
        setBillAmount("");
        setBillDueDate("");
        setTrigger(trigger + 1);
      })
      .catch((err) => console.error("Add bill error:", err));
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-xl mb-10 flex flex-col space-y-4">
  <h2 className="text-2xl font-bold text-center">Bill Payments</h2>

  <AccountDropdown
    accounts={accounts}
    selectedAccount={selectedAccount}
    onChange={setSelectedAccount}
  />

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

  <button
    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
    onClick={handleAddBill}
  >
    Add Bill
  </button>
</div>


        <div className="mt-10 bg-white shadow-md rounded-xl p-6 w-full max-w-xl">
          <h3 className="text-xl font-semibold mb-4 text-center">Scheduled Bills</h3>
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
            <p className="text-center text-gray-500">No bills scheduled.</p>
          )}
        </div>
      </div>
    </>
  );
}
