"use server";

import axios from "axios";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

/** Profile user shape - single source for UI (header + profile modal). */
export interface ProfileUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  currency?: string;
  monthlyBudget?: number;
}

/** Turn relative avatar URL into absolute so it works after refresh. */
function toAbsoluteAvatarUrl(avatar: string | undefined): string | undefined {
  if (!avatar?.trim()) return undefined;
  if (avatar.startsWith("http://") || avatar.startsWith("https://"))
    return avatar;
  const base = (API_BASE_URL ?? "").replace(/\/$/, "");
  if (!base) return avatar;
  const path = avatar.startsWith("/") ? avatar : `/${avatar}`;
  return `${base}${path}`;
}

/** Extract and normalize user from API response - single source shape. */
function toProfileUser(raw: unknown): ProfileUser | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;
  const data = obj.data ?? obj;
  const user =
    (data as Record<string, unknown>)?.user ??
    (data as Record<string, unknown>)?.data ??
    data;
  if (!user || typeof user !== "object") return null;
  const u = user as Record<string, unknown>;
  const profile = (u.profile as Record<string, unknown> | undefined) ?? {};
  const id = String(u.id ?? u._id ?? "").trim();
  const name = String(u.name ?? "").trim();
  const email = String(u.email ?? "").trim();
  if (!email) return null;
  const avatarRaw = String(
    u.avatar ??
      u.avatarUrl ??
      u.profileImage ??
      profile.avatar ??
      profile.avatarUrl ??
      "",
  ).trim();
  const avatar = toAbsoluteAvatarUrl(avatarRaw || undefined);
  const currency =
    typeof u.currency === "string"
      ? u.currency
      : typeof profile.currency === "string"
        ? profile.currency
        : undefined;
  const monthlyBudget =
    typeof u.monthlyBudget === "number"
      ? u.monthlyBudget
      : typeof profile.monthlyBudget === "number"
        ? profile.monthlyBudget
        : undefined;
  return {
    id: id || email,
    name: name || email,
    email,
    avatar: avatar || undefined,
    currency,
    monthlyBudget,
  };
}

// Helper function to get auth headers
async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// ==================== AUTHENTICATION ====================

export async function loginUser(data: { email: string; password: string }) {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const token = response.data.token;

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        "Login failed. Please try again.",
    };
  }
}

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/auth/register`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const token = response.data.token;

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        "Registration failed. Please try again.",
    };
  }
}

export async function logoutUser() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("token");

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: "Logout failed. Please try again.",
    };
  }
}

// ==================== USER PROFILE ====================

/** Single source for profile/avatar – always use getProfile(); never use updateProfile response for UI. */
export async function getProfile(): Promise<
  | { success: true; data: { data: ProfileUser } }
  | { success: false; error: string }
> {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(`${API_BASE_URL}/api/user/get-profile`, {
      headers,
    });

    const user = toProfileUser(response.data);
    if (!user) {
      return { success: false, error: "Invalid profile response." };
    }
    return { success: true, data: { data: user } };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch profile.",
    };
  }
}

export async function updateProfile(formData: FormData) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    await axios.put(`${API_BASE_URL}/api/user/update-profile`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update profile.",
    };
  }
}

// ==================== EXPENSES ====================

export async function createExpense(data: {
  amount: number;
  category: string;
  date: string;
  description?: string;
}) {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.post(`${API_BASE_URL}/api/expenses`, data, {
      headers,
    });

    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to create expense.",
    };
  }
}

export async function getAllExpenses(params?: {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
  startDate?: string;
  endDate?: string;
  category?: string;
}) {
  try {
    const headers = await getAuthHeaders();
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = `${API_BASE_URL}/api/expenses${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    const response = await axios.get(url, { headers });

    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch expenses.",
    };
  }
}

export async function getExpenseById(id: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.get(`${API_BASE_URL}/api/expenses/${id}`, {
      headers,
    });

    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch expense.",
    };
  }
}

export async function updateExpense(
  id: string,
  data: {
    amount?: number;
    category?: string;
    date?: string;
    description?: string;
  },
) {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.put(
      `${API_BASE_URL}/api/expenses/${id}`,
      data,
      { headers },
    );

    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update expense.",
    };
  }
}

export async function deleteExpense(id: string) {
  try {
    const headers = await getAuthHeaders();
    const response = await axios.delete(`${API_BASE_URL}/api/expenses/${id}`, {
      headers,
    });

    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete expense.",
    };
  }
}

// ==================== ANALYTICS ====================

export async function getExpenseSummary(params?: {
  startDate?: string;
  endDate?: string;
}) {
  try {
    const headers = await getAuthHeaders();
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = `${API_BASE_URL}/api/expenses/summary${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    const response = await axios.get(url, { headers });

    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch summary.",
    };
  }
}

/** Category chart: use timeFilter (24h, 7d, 30d, 90d, all) or custom startDate/endDate. */
export async function getCategoryChartData(params?: {
  timeFilter?: "24h" | "7d" | "30d" | "90d" | "all";
  startDate?: string;
  endDate?: string;
}) {
  try {
    const headers = await getAuthHeaders();
    const queryParams = new URLSearchParams();

    if (params) {
      if (params.timeFilter) {
        queryParams.append("timeFilter", params.timeFilter);
      }
      if (params.startDate) queryParams.append("startDate", params.startDate);
      if (params.endDate) queryParams.append("endDate", params.endDate);
    }

    const url = `${API_BASE_URL}/api/expenses/chart/category${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    const response = await axios.get(url, { headers });

    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch category data.",
    };
  }
}

/** Trend chart: period = weekly | monthly | yearly, optional startDate/endDate. */
export async function getTrendData(params?: {
  period?: "weekly" | "monthly" | "yearly";
  startDate?: string;
  endDate?: string;
}) {
  try {
    const headers = await getAuthHeaders();
    const queryParams = new URLSearchParams();
    if (params?.period) queryParams.append("period", params.period);
    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);

    const url = `${API_BASE_URL}/api/expenses/chart/trend${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    const response = await axios.get(url, { headers });

    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch trend data.",
    };
  }
}

/** Monthly trend (uses new trend API with period=monthly). */
export async function getMonthlyTrendData(params?: {
  startDate?: string;
  endDate?: string;
}) {
  return getTrendData({ period: "monthly", ...params });
}

/** Get list of all expense categories from API. */
export async function getCategories() {
  try {
    const headers = await getAuthHeaders();
    const url = `${API_BASE_URL}/api/categories`;
    const response = await axios.get(url, { headers });
    return { success: true, data: response.data };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch categories.",
    };
  }
}
