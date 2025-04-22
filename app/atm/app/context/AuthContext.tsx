'use client';
import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/authorized`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Unauthorized");
          }
        })
        .then((data) => {
          if (data.authorized) {
            console.log("User is authorized");
            setUser(data.user);
            setIsLoggedIn(true);
          } else {
            console.warn("User not authorized", data.error);
          }
        })
        .catch((err) => {
          console.log("Auth check failed:", err.message);
          setUser(null);
          setIsLoggedIn(false);
        });
    };

    checkLoginStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
