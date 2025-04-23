'use client';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import MoneyManager from './MoneyManager';

export default function ATMPage() {
  const { isLoggedIn } = useAuth()
  return (
    <div>
    <Navbar />
    {isLoggedIn ? (
        <MoneyManager/>
    ) : (
      <div>Please login first to view.</div>
    )}
    </div>
  )
}

