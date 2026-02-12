"use client";

import {
  getProfile,
  getUserFromCookies,
  logoutAction,
} from "@/app/action/auth";
import { ProfileSidebar } from "@/components/Profile/ProfileSidebar";
import { UserDropdown } from "@/components/shared/UserDropdown";
import { useAuth } from "@/context/AuthContext.client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const { user, login, logout } = useAuth();
  const pathname = usePathname();
  const [isProfileSidebarOpen, setIsProfileSidebarOpen] = useState(false);

  useEffect(() => {
    // Only load user data once on mount, if not already loaded
    if (user) return;

    let isMounted = true;

    const loadUser = async () => {
      const userData = await getUserFromCookies();
      if (!isMounted) return;

      console.log("Header - User data from cookies:", userData);

      if (userData) {
        // If avatar is missing from cookies, try to fetch fresh profile data
        if (!userData.avatar) {
          try {
            const profileResult = await getProfile();
            if (profileResult.success && profileResult.data) {
              const profile = profileResult.data;
              // Handle nested profile structure and flat structure
              const avatar =
                profile.avatar ||
                profile.profile?.avatar ||
                profile.avatarUrl ||
                profile.profilePicture ||
                profile.image;

              if (avatar) {
                console.log("Header - Fetched missing avatar:", avatar);
                userData.avatar = avatar;
              }
            }
          } catch (err) {
            console.error("Header - Failed to fetch profile for avatar:", err);
          }
        }

        login(userData);
      }
    };

    loadUser();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const handleLogout = async () => {
    logout();
    await logoutAction();
  };

  const handleProfileClick = () => {
    setIsProfileSidebarOpen(true);
  };

  return (
    <header className="bg-gray-900 border-b border-gray-800 shadow-lg">
      <div className="max-w-8xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <strong className="text-3xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            ET
          </strong>
        </div>

        {user ? (
          <>
            <UserDropdown
              userName={user.name}
              avatar={user.avatar}
              onLogout={handleLogout}
              onProfileClick={handleProfileClick}
            />
            <ProfileSidebar
              open={isProfileSidebarOpen}
              onClose={() => setIsProfileSidebarOpen(false)}
              user={{
                name: user.name || "User",
                email: user.email || "",
                phone: user.phone || "",
                currency: user.currency || "USD",
                isEmailVerified: user.isEmailVerified || false,
                avatar: user.avatar || "",
              }}
            />
          </>
        ) : (
          <span className="text-gray-400">Welcome</span>
        )}
      </div>
    </header>
  );
}
