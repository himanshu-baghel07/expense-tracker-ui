"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function getUserFromCookies() {
  const cookieStore = await cookies();
  const userName = cookieStore.get("userName")?.value;
  const userId = cookieStore.get("userId")?.value;
  const userEmail = cookieStore.get("userEmail")?.value;
  const session = cookieStore.get("session")?.value;

  if (!session || !userName) {
    return null;
  }

  return {
    name: userName,
    id: userId,
    email: userEmail,
    avatar: cookieStore.get("userAvatar")?.value,
  };
}

export async function getProfile() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return {
      success: false,
      message: "No authentication token found",
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/user/get-profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to fetch profile",
      };
    }

    return {
      success: true,
      data: data.data || data,
    };
  } catch (error) {
    return {
      success: false,
      message: "Network error. Please try again.",
    };
  }
}

export async function updateUserProfile(
  profileData:
    | FormData
    | {
        name?: string;
        email?: string;
        phone?: string;
        currency?: string;
        monthlyBudget?: number;
      },
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  console.log("🔧 Update Profile - Starting");
  console.log("🔑 Token exists:", !!token);
  console.log("🌐 API Base URL:", API_BASE_URL);
  console.log(
    "📦 Input type:",
    profileData instanceof FormData ? "FormData" : "Object",
  );

  if (!token) {
    console.error("❌ No authentication token found");
    return {
      success: false,
      message: "No authentication token found",
    };
  }

  try {
    // Convert object to FormData if needed
    let formData: FormData;
    if (profileData instanceof FormData) {
      formData = profileData;
    } else {
      formData = new FormData();
      Object.entries(profileData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
    }

    // Log FormData contents
    console.log("� FormData contents:");
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(
          `  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`,
        );
      } else {
        console.log(`  ${key}:`, value);
      }
    }

    const url = `${API_BASE_URL}/api/user/update-profile`;
    console.log("🚀 Making request to:", url);

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    console.log("📡 Response status:", response.status);
    console.log("📡 Response ok:", response.ok);

    const data = await response.json();
    console.log("📥 Response data:", data);

    if (!response.ok) {
      console.error("❌ Update failed:", data.message);
      return {
        success: false,
        message: data.message || "Failed to update profile",
      };
    }

    // Update cookies with new data if name changed
    const name = formData.get("name") as string;
    if (name) {
      console.log("🍪 Updating userName cookie to:", name);
      (await cookies()).set("userName", name, {
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
    }

    // Update avatar cookie if changed
    const avatar =
      data.data?.profile?.avatar ||
      data.data?.avatar ||
      data.data?.avatarUrl ||
      formData.get("avatar");
    if (typeof avatar === "string" && avatar.startsWith("http")) {
      console.log("🍪 Updating userAvatar cookie");
      (await cookies()).set("userAvatar", avatar, {
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
    }

    console.log("✅ Profile updated successfully");
    return {
      success: true,
      message: data.message || "Profile updated successfully",
      data: data.data || data,
    };
  } catch (error) {
    console.error("❌ Update Profile Error:", error);
    console.error("Error details:", {
      name: error instanceof Error ? error.name : "Unknown",
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return {
      success: false,
      message: "Network error. Please try again.",
    };
  }
}

export async function signupAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email: email.toLowerCase(),
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Registration failed",
      };
    }

    return {
      success: true,
      message: data.message || "User registered successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Network error. Please try again.",
    };
  }
}

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Login failed",
      };
    }

    // Console log the successful login response
    console.log("Login Success Response:", data);

    // ✅ Set session cookie with token
    (await cookies()).set("session", data.token, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    // Store user ID if needed
    (await cookies()).set("userId", data.id, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    // Store user name for display
    (await cookies()).set("userName", data.name || email.split("@")[0], {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    // Store user email
    (await cookies()).set("userEmail", data.email || email, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    // Store user avatar
    const avatarInfo =
      data.avatar ||
      data.profile?.avatar ||
      data.avatarUrl ||
      data.user?.avatar ||
      data.user?.profile?.avatar;

    if (avatarInfo) {
      (await cookies()).set("userAvatar", avatarInfo, {
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
    }

    // ✅ Server-side redirect
    redirect("/dashboard");
  } catch (error) {
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      throw error;
    }
    return {
      success: false,
      message: "Network error. Please try again.",
    };
  }
}

export async function logoutAction() {
  try {
    await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Clear cookies regardless of API response
    (await cookies()).delete("session");
    (await cookies()).delete("userId");
    (await cookies()).delete("userName");
    (await cookies()).delete("userEmail");
    (await cookies()).delete("userAvatar");

    // Redirect to home page
    redirect("/");
  } catch (error) {
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      throw error;
    }
    // Even if API fails, clear cookies and redirect
    (await cookies()).delete("session");
    (await cookies()).delete("userId");
    (await cookies()).delete("userName");
    (await cookies()).delete("userEmail");
    (await cookies()).delete("userAvatar");
    redirect("/");
  }
}
