"use client";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";


export default function AdminDashboard() {
    // const [users, setUsers] = useState([]);
    const [reports, setReports] = useState([]);

    useEffect(() => {

        // fetch("http://localhost:12094/bank_manager/all_users", {
        //     method: "GET",
        //     credentials: "include",
        //     headers: { "Content-Type": "application/json" },
        // })
        //     .then((response) => response.json())
        //     .then((data) => {
        //         console.log(data);
        //         setUsers(data);
        //     })
        //     .catch((error) => console.error("Fetch error:", error));
 
        fetch("http://localhost:12094/bank_manager/generate_report", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data.csv_user_reports);

                // Using user reports for now, will use csv_user_reports later
                console.log(data.user_reports);
                setReports(data.user_reports);
        })
        .catch((error) => console.error("Fetch error:", error));

        fetch("http://localhost:12094/bank_manager/all_report_batches", {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
        })
        .catch((error) => console.error("Fetch error:", error));
    }, []);

    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex-grow flex items-center justify-center bg-gray-100">
                <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-4 text-black">Admin Dashboard</h2>
                    <p className="text-black">Welcome to the admin dashboard.</p>
                </div>
                <div className="mt-4">
                    <h3 className="text-xl font-semibold mb-2 text-black">User List</h3>
                    <table className="table-auto w-full border-collapse border border-black">
                        <thead>
                            <tr>
                                <th className="border border-black px-4 py-2 text-black">ID</th>
                                <th className="border border-black px-4 py-2 text-black">Full Name</th>
                                <th className="border border-black px-4 py-2 text-black">Zip Code</th>
                                <th className="border border-black px-4 py-2 text-black">Total Accounts</th>
                                <th className="border border-black px-4 py-2 text-black">Total Balance</th>
                                <th className="border border-black px-4 py-2 text-black">Total Transactions</th>
                                <th className="border border-black px-4 py-2 text-black">Total Money Deposited</th>
                                <th className="border border-black px-4 py-2 text-black">Total Money Withdrawn</th>
                                <th className="border border-black px-4 py-2 text-black">Total Money Transferred</th>
                                <th className="border border-black px-4 py-2 text-black">Total Money Received</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map((report: any) => (
                                <tr key={report.id}>
                                    <td className="border border-black px-4 py-2 text-black">{report.id}</td>
                                    <td className="border border-black px-4 py-2 text-black">{report.full_name}</td>
                                    <td className="border border-black px-4 py-2 text-black">{report.zip_code}</td>
                                    <td className="border border-black px-4 py-2 text-black">{report.total_accounts}</td>
                                    <td className="border border-black px-4 py-2 text-black">{report.total_balance}</td>
                                    <td className="border border-black px-4 py-2 text-black">{report.total_transactions}</td>
                                    <td className="border border-black px-4 py-2 text-black">{report.total_money_deposited}</td>
                                    <td className="border border-black px-4 py-2 text-black">{report.total_money_withdrawn}</td>
                                    <td className="border border-black px-4 py-2 text-black">{report.total_money_transferred}</td>
                                    <td className="border border-black px-4 py-2 text-black">{report.total_money_received}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}