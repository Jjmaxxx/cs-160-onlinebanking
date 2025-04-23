"use client";
import { useState, useEffect } from "react";
import { deposit, withdraw, transferToAccount, transferToSelf } from "../utils/api";
import  AccountDropdown  from "./account_dropdown";

export default function MoneyManager() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [amount, setAmount] = useState("");
  const [transferAccountNum, setTransferAccountNum] = useState("");
  const [transferAccount, setTransferAccount] = useState(null);

  const [popupType, setPopupType] = useState(null);
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/accounts`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        setAccounts(data.accounts);

        // Ensure selectedAccount updates if its balance has changed
        if (selectedAccount) {
          const updatedAccount = data.accounts.find(
            (acc) => acc.id === selectedAccount.id
          );
          if (updatedAccount) {
            setSelectedAccount(updatedAccount);
          }
        } else if (data.accounts.length > 0) {
          setSelectedAccount(data.accounts[0]);
        }
      })
      .catch((error) => console.error("Fetch error:", error));
  }, [trigger]);

  const displayTransactionResult = (resp) => {
    resp.then((message) => {
      // Handle success or failure
      alert(message);
    })
    .catch((error) => {
      // Handle error
      console.error(`$error:`, error);
    });
  }

  const handleTransaction = (type) => {
    let result = null;
    if (!selectedAccount) return;
    const numAmount = parseFloat(amount);

    if (type === "withdraw") {
      if (isNaN(numAmount) || numAmount <= 0) return;
      result = withdraw(selectedAccount.id, numAmount)
    } else if (type === "deposit") {
      if (isNaN(numAmount) || numAmount <= 0) return;
      result = deposit(selectedAccount.id, numAmount)
    }
     else if (type === "transfer") {
      if (isNaN(numAmount) || numAmount <= 0) return;
      if (transferAccountNum && transferAccountNum.trim() !== "") {
        result = transferToAccount(
          selectedAccount.id,
          Number(transferAccountNum),
          numAmount
        );
      } else if (transferAccount) {
        result = transferToSelf(
          selectedAccount.id,
          transferAccount.account_number,
          numAmount
        );
      }
     }
    displayTransactionResult(result);
    // setTrigger(trigger + 1);
    setAmount("");
    setPopupType(null);

    // Need to wait for the backend to finish before triggering frontend to refresh
    if (result) {
      result.then((_) =>{
        setTrigger(trigger + 1);
      });
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-96 p-6 shadow-xl bg-white rounded-2xl">
          <h2 className="text-2xl font-bold text-center mb-4">Transact</h2>
          {accounts.length > 0 ? (
            <>
              <AccountDropdown
                accounts={accounts}
                selectedAccount={selectedAccount}
                onChange={setSelectedAccount}
              />
              <p className="text-xl text-center mb-4">
                Balance: ${selectedAccount?.balance}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setPopupType("withdraw")}
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                >
                  Withdraw
                </button>
                <button
                  onClick={() => setPopupType("deposit")}
                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                >
                  Deposit
                </button>
                <button
                  onClick={() => setPopupType("transfer")}
                  className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded"
                >
                  Transfer Funds
                </button>
              </div>
            </>
          ) : (
            <p className="text-center">Loading accounts...</p>
          )}
        </div>

        {popupType && selectedAccount && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
              <h3 className="text-xl font-bold mb-4">
                {popupType.replace(/\b\w/g, (c) => c.toUpperCase())}
              </h3>
              {(popupType === "withdraw" ||
                popupType === "deposit" ||
                popupType === "transfer") && (
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mb-4 w-full px-4 py-2 border rounded"
                />
              )}
              {popupType === "transfer" && (
                <>
                  <input
                    type="email"
                    placeholder="Enter recipient's account Number"
                    value={transferAccountNum}
                    onChange={(e) => {
                      setTransferAccountNum(e.target.value)
                      setTransferAccount("");
                    }}
                    className="mb-4 w-full px-4 py-2 border rounded"
                  />
                  <br></br>
                  OR
                  <br></br>
                  <AccountDropdown
                    accounts={accounts.filter(
                      (acc) => acc.id !== selectedAccount.id
                    )}
                    selectedAccount={transferAccount}
                    onChange={(acc) => {
                      setTransferAccount(acc);
                      setTransferAccountNum(""); // Clear email if account is selected
                    }}/>
                </>
              )}
              <div className="flex justify-between">
                <button
                  onClick={() => handleTransaction(popupType)}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setPopupType(null)}
                  className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
