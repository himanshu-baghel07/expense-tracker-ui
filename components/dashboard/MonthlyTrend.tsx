"use client";

import { getTrendData } from "@/lib/actions/auth.action";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

interface MonthlyData {
  _id?: {
    year?: number;
    month?: number;
    week?: number;
  };
  year?: number;
  month?: number;
  totalAmount: number;
  count: number;
}

const PERIOD_OPTIONS: {
  value: "weekly" | "monthly" | "yearly";
  label: string;
}[] = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

export default function MonthlyTrend() {
  const [data, setData] = useState<MonthlyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<"weekly" | "monthly" | "yearly">(
    "monthly",
  );

  useEffect(() => {
    fetchTrendData();
  }, [period]);

  const fetchTrendData = async () => {
    setIsLoading(true);
    const [result] = await Promise.allSettled([getTrendData({ period })]);

    if (result.status === "fulfilled" && result.value.success) {
      const raw = result.value.data.data || [];
      setData(Array.isArray(raw) ? raw : []);
    }
    setIsLoading(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getMonthName = (month: number) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months[month - 1] ?? "—";
  };

  const getPeriodLabel = (item: MonthlyData) => {
    const month = item._id?.month ?? item.month;
    const year = item._id?.year ?? (item as { year?: number }).year;
    const week = item._id?.week ?? (item as { week?: number }).week;
    if (period === "monthly" && month) return getMonthName(month);
    if (period === "yearly" && year) return String(year);
    if (period === "weekly" && week != null) return `W${week}`;
    return month ? getMonthName(month) : "—";
  };

  const safeData = data.filter(
    (d) => d != null && typeof d.totalAmount === "number",
  );
  const maxAmount = Math.max(...safeData.map((d) => d.totalAmount), 0);

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Expense Trend
          </CardTitle>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as typeof period)}
            className="flex h-9 w-full min-w-[120px] max-w-[160px] rounded-md border border-gray-800 bg-black px-3 py-1.5 text-sm text-white ring-offset-black focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 sm:w-auto"
          >
            {PERIOD_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-800 border-t-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const summaryLabel =
    period === "weekly"
      ? "Total Weeks"
      : period === "yearly"
        ? "Total Years"
        : "Total Months";
  const highestLabel =
    period === "weekly"
      ? "Highest Week"
      : period === "yearly"
        ? "Highest Year"
        : "Highest Month";

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Expense Trend
        </CardTitle>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as typeof period)}
          className="flex h-9 w-full min-w-[120px] max-w-[160px] rounded-md border border-gray-800 bg-black px-3 py-1.5 text-sm text-white ring-offset-black focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 sm:w-auto"
        >
          {PERIOD_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </CardHeader>
      <CardContent>
        {safeData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <TrendingUp className="h-12 w-12 text-gray-600 mb-4" />
            <p className="text-gray-400">No trend data available</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-end justify-between gap-2 h-48">
              {safeData.slice(-6).map((item, index) => {
                const month = item._id?.month ?? item.month ?? 0;
                const height =
                  maxAmount > 0 ? (item.totalAmount / maxAmount) * 100 : 0;
                return (
                  <div
                    key={
                      item._id
                        ? `${item._id.year ?? ""}-${month}-${index}`
                        : index
                    }
                    className="flex flex-col items-center gap-2 flex-1"
                  >
                    <div className="w-full flex items-end h-full">
                      <div
                        className="w-full bg-gradient-to-t from-blue-600 to-purple-600 rounded-t-md hover:opacity-80 transition-opacity cursor-pointer relative group"
                        style={{ height: `${height}%`, minHeight: "4px" }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 px-2 py-1 rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                          {formatCurrency(item.totalAmount)}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {getPeriodLabel(item)}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-gray-800 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">{summaryLabel}</p>
                <p className="text-lg font-semibold text-white">
                  {safeData.length}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">{highestLabel}</p>
                <p className="text-lg font-semibold text-white">
                  {formatCurrency(maxAmount)}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
