"use client"

import { useState, useEffect, use } from "react"
import { BellIcon, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { set } from "date-fns"

export function DashboardHeader() {
  const [fullName, setFullName] = useState("");


  const handleLogout = async () => {
    try {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((_) => {
        window.location.href = "/";
      })
      .catch((error) => console.error("Fetch error:", error));
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  }

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/info`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setFullName(data.first_name + " " + data.last_name);
      })
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
      <div className="w-full flex-1">
        <form>
        </form>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
        </DropdownMenuTrigger>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="ml-auto h-8 gap-1">
            <span className="hidden sm:inline-flex">{fullName}</span>
            <span className="inline-flex sm:hidden">JS</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
            <a href="/">Home</a>
            </DropdownMenuItem>
          <DropdownMenuSeparator />
            {/* Activate handleLogout on click */}
            <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
