'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { isLoggedIn } = useAuth()
  const handleGoogleLogin = async () => {
    try {
      const port = window.location.port || 3000;
      window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google/login?port=${port}`;
    } catch (error) {
      console.error('Error during Google login request:', error);
    }
  };

  const [isBankManager, setIsBankManager] = useState(false);
  
    useEffect(() => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/bank_manager/info`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => response.json())
        .then((data) => {
          setIsBankManager(data.id);
        })
        .catch((error) => console.error("Fetch error:", error));
    }, []);

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

  const handleAdmin = async () => {
    try {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/become_admin`, {
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


     return (<nav className="w-full bg-gray-900 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">BANK</h1>
        <div className="space-x-4">
          <a href="/" className="hover:text-gray-400">Home</a>
          {/* For when user is logged in, sho more in navbar */}
          {isLoggedIn &&
            <>
              <a href="/maps" className="hover:text-gray-400">Find ATMs</a>
                <a href="/user-form" className="hover:text-gray-400">Profile Information</a>
                {isBankManager ? (
                <a href="/dashboard" className="hover:text-gray-400">Dashboard</a>
                ) : (
                <a onClick={handleAdmin} className="hover:text-gray-400">Become an Admin</a>
                )}
                {/* <a href="/transact" className="hover:text-gray-400">Transact</a> */}
              <a href="#" onClick={handleLogout} className="hover:text-gray-400">Logout</a>
            </>
          }

          {/* When user not logged in, hide above and only show login */}
          {!isLoggedIn && (<a href="#" onClick={handleGoogleLogin} className="hover:text-gray-400">Login with Google</a>)}
        </div>
      </nav>);
}

export default Navbar;