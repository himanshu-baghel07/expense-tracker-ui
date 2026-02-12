"use client";

import { getUserFromCookies } from "@/app/action/auth";
import { useAuth } from "@/context/AuthContext.client";
import { useEffect, useState } from "react";

export default function DashboardUI() {
  const { user, login } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only load user data once on mount, if not already loaded
    if (user) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const loadUserData = async () => {
      const userData = await getUserFromCookies();

      if (!isMounted) return;

      console.log("User data from cookies:", userData);

      if (userData) {
        // Update AuthContext with user data from cookies
        login({
          name: userData.name,
          id: userData.id,
          email: userData.email,
        });
      }

      setIsLoading(false);
    };

    loadUserData();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  if (isLoading) {
    return (
      <div>
        <h1>Dashboard</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.name || "Guest"}</p>
      {user?.email && <p>Email: {user.email}</p>}
      {user?.id && <p>User ID: {user.id}</p>}
    </div>
  );
}
