"use client";

import { useState, useEffect } from "react";

import Navbar from './components/Navbar';

async function userLoggedIn() {
  const url = `http://localhost:12094/example_protected_route`;
  
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
        "Content-Type": "application/json"
      }
    }
  );
  const json = await response.json();
  return json;
}

export default function Intro() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function checkLogin() {
      const userData = await userLoggedIn();
      console.log(userData);
      console.log("test");
      setUser(userData);
    }

    checkLogin();
  }, []);

  return (
    <div>
        <Navbar />
        {user ? <p>Welcome, {user.email}</p> : <p>Not logged in</p>}
    </div>
  );
}