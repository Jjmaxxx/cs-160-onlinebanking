"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "../components/Navbar";

export default function TransactionsTable() {
  const [filter, setFilter] = useState({
    zip_code: "",
    full_name: "",
    city: "",
    state: "",
  });

  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [viewingReport, setViewingReport] = useState(false);
  const [currentReportIndex, setCurrentReportIndex] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bank_manager/summarize_transactions`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        const result = await response.json();
        setData(result);
        setAllData(result);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setLoading(false);
      }
    }

    async function fetchReports() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bank_manager/get_all_reports`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        const result = await response.json();
        setReports(result);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      }
    }

    fetchData();
    fetchReports();
  }, []);

  const filteredData = data.filter((item) => {
    return (
      item.full_name.toLowerCase().includes(filter.full_name.toLowerCase()) &&
      item.zip_code?.toString().includes(filter.zip_code) &&
      item.city?.toLowerCase().includes(filter.city.toLowerCase()) &&
      item.state?.toLowerCase().includes(filter.state.toLowerCase())
    );
  });

  const handleSaveReport = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bank_manager/save_report`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filteredData),
      });
      alert("Report saved successfully!");
    } catch (error) {
      console.error("Failed to save report:", error);
      alert("Failed to save report.");
    }
  };

  const handleSelectReport = (report, index) => {
    setData(report);
    setViewingReport(true);
    setCurrentReportIndex(index);
  };

  const handleReset = () => {
    window.location.reload();
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className="p-4 space-y-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">
            {viewingReport
              ? `Viewing Saved Report ${currentReportIndex !== null ? `(Report ${currentReportIndex + 1})` : ""}`
              : "Viewing Live Data"}
          </h1>
          <Button onClick={handleReset}>Reset</Button>
        </div>

        <Card>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
            <Input
              placeholder="Filter by Name"
              value={filter.full_name}
              onChange={(e) => setFilter({ ...filter, full_name: e.target.value })}
            />
            <Input
              placeholder="Filter by Zip Code"
              value={filter.zip_code}
              onChange={(e) => setFilter({ ...filter, zip_code: e.target.value })}
            />
            <Input
              placeholder="Filter by City"
              value={filter.city}
              onChange={(e) => setFilter({ ...filter, city: e.target.value })}
            />
            <Input
              placeholder="Filter by State"
              value={filter.state}
              onChange={(e) => setFilter({ ...filter, state: e.target.value })}
            />
          </CardContent>
        </Card>

        <Button onClick={handleSaveReport}>Save Report</Button>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Address</th>
                <th className="p-2 border">City</th>
                <th className="p-2 border">State</th>
                <th className="p-2 border">Zip</th>
                <th className="p-2 border">Accounts</th>
                <th className="p-2 border">Transactions</th>
                <th className="p-2 border">Money Moved</th>
                <th className="p-2 border">Total Balance</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-2 border">{item.full_name}</td>
                  <td className="p-2 border">{item.email}</td>
                  <td className="p-2 border">{item.address}</td>
                  <td className="p-2 border">{item.city}</td>
                  <td className="p-2 border">{item.state}</td>
                  <td className="p-2 border">{item.zip_code}</td>
                  <td className="p-2 border">{item.number_of_accounts}</td>
                  <td className="p-2 border">{item.transactions}</td>
                  <td className="p-2 border">${item.money_moved.toLocaleString()}</td>
                  <td className="p-2 border">${item.total_balance.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Saved Reports</h2>
          <ul className="list-disc list-inside">
            {reports.map((report, index) => (
              <li
                key={index}
                className="cursor-pointer text-blue-500 hover:underline"
                onClick={() => handleSelectReport(report, index)}
              >
                Report {index + 1}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
