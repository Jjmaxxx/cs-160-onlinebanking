'use client';

import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { isLoggedIn } = useAuth()
  const handleGoogleLogin = async () => {
    try {
        const port = window.location.port || 3001;
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google/login?port=${port}`;
    } catch (error) {
      console.error('Error during Google login request:', error);
    }
  };

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

     return (<nav className="w-full bg-gray-900 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">ATM Page</h1>
        <div className="space-x-4">
        {isLoggedIn ? (
            <a href="#" onClick={handleLogout} className="hover:text-gray-400">Logout</a>
        ) : (
            <a href="#" onClick={handleGoogleLogin} className="hover:text-gray-400">Login with Google</a>
        )}
          
        </div>
      </nav>);
}

export default Navbar;