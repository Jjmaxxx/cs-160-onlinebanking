'use client';

import { useState, useEffect } from "react";
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { isLoggedIn, user } = useAuth()
  const handleGoogleLogin = async () => {
    try {
      window.location.href = "http://localhost:12094/auth/google/login";
    } catch (error) {
      console.error('Error during Google login request:', error);
    }
  };

  const handleLogout = async () => {
    try {
    fetch("http://localhost:12094/auth/logout", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        // Redirect to homepage
        window.location.href = "/";
      })
      .catch((error) => console.error("Fetch error:", error));
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  }
  
  // useEffect(() => {
  //   // Check if user is logged in
  //   fetch("http://localhost:12094/user/info", {
  //     method: "GET",
  //     credentials: "include",
  //     headers: { "Content-Type": "application/json" },
  //   })
  //     .then((response) => {
  //       if (response.status === 401)
  //       setIsLoggedIn(response.ok)
  //       return response.json()
  //     })
  //     .catch((error) => console.error("Fetch error:", error));
  // }, []);


     return (<nav className="w-full bg-gray-900 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">BANK</h1>
        <div className="space-x-4">
          <a href="/" className="hover:text-gray-400">Home</a>
          <a href="/maps" className="hover:text-gray-400">Find ATMs</a>
          <a href="#" className="hover:text-gray-400">Contact</a>

          {/* For when user is logged in, sho more in navbar */}
          {isLoggedIn &&
            <>
              <a href="/transact" className="hover:text-gray-400">Transact</a>
              <a href="#" onClick={handleLogout} className="hover:text-gray-400">Logout</a>
            </>
          }

          {/* When user not logged in, hide above and only show login */}
          {!isLoggedIn && (<a href="#" onClick={handleGoogleLogin} className="hover:text-gray-400">Login with Google</a>)}
        </div>
      </nav>);
}

export default Navbar;