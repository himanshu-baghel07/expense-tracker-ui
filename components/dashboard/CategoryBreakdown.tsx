"use client";

import { getCategoryChartData } from "@/lib/actions/auth.action";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { PieChart as PieChartIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface CategoryData {
  _id: string;
  totalAmount: number;
  count: number;
}

const CHART_COLORS = [
  "#ea580c", // orange-600
  "#2563eb", // blue-600
  "#9333ea", // purple-600
  "#db2777", // pink-600
  "#dc2626", // red-600
  "#16a34a", // green-600
  "#4f46e5", // indigo-600
  "#4b5563", // gray-600
];

const TIME_FILTER_OPTIONS: { value: "24h" | "7d" | "30d" | "90d" | "all"; label: string }[] = [
  { value: "24h", label: "Last 24 hours" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "all", label: "All time" },
];

export default function CategoryBreakdown() {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [timeFilter, setTimeFilter] = useState<"24h" | "7d" | "30d" | "90d" | "all">("30d");

  useEffect(() => {
    fetchCategories();
  }, [timeFilter]);

  const fetchCategories = async () => {
    setIsLoading(true);
    const result = await getCategoryChartData({ timeFilter });

    if (result.success) {
      const data = result.data.data || [];
      setCategories(data);
      const totalAmount = data.reduce(
        (sum: number, cat: CategoryData) => sum + cat.totalAmount,
        0,
      );
      setTotal(totalAmount);
    }
    setIsLoading(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getPercentage = (amount: number) => {
    if (total === 0) return 0;
    return ((amount / total) * 100).toFixed(1);
  };

  const chartData = categories.map((cat, i) => ({
    name: cat._id,
    value: cat.totalAmount,
    count: cat.count,
    fill: CHART_COLORS[i % CHART_COLORS.length],
  }));

  const renderTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number; payload: { count: number } }[] }) => {
    if (!active || !payload?.length) return null;
    const item = payload[0];
    return (
      <div className="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 shadow-lg">
        <p className="font-medium text-white">{item.name}</p>
        <p className="text-sm text-gray-300">{formatCurrency(item.value)}</p>
        <p className="text-xs text-gray-500">
          {item.payload.count} transaction{item.payload.count !== 1 ? "s" : ""} · {getPercentage(item.value)}%
        </p>
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5" />
            Category Breakdown
          </CardTitle>
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value as typeof timeFilter)}
            className="flex h-9 w-full min-w-[140px] max-w-[180px] rounded-md border border-gray-800 bg-black px-3 py-1.5 text-sm text-white ring-offset-black focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 sm:w-auto"
          >
            {TIME_FILTER_OPTIONS.map((opt) => (
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

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="flex items-center gap-2">
          <PieChartIcon className="h-5 w-5" />
          Category Breakdown
        </CardTitle>
        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value as typeof timeFilter)}
          className="flex h-9 w-full min-w-[140px] max-w-[180px] rounded-md border border-gray-800 bg-black px-3 py-1.5 text-sm text-white ring-offset-black focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 sm:w-auto"
        >
          {TIME_FILTER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </CardHeader>
      <CardContent>
        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <PieChartIcon className="h-12 w-12 text-gray-600 mb-4" />
            <p className="text-gray-400">No category data available</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="h-[280px] min-h-[280px] w-full min-w-0">
              <ResponsiveContainer
                width="100%"
                height="100%"
                minHeight={280}
                minWidth={0}
                initialDimension={{ width: 400, height: 280 }}
              >
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    stroke="var(--background)"
                    strokeWidth={2}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={renderTooltip} />
                  <Legend
                    formatter={(value, entry) => {
                      const payload = entry?.payload as { value?: number } | undefined;
                      const pct = payload?.value != null ? getPercentage(payload.value) : "0";
                      return (
                        <span className="text-sm text-gray-300">
                          {value} ({pct}%)
                        </span>
                      );
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="pt-2 border-t border-gray-800">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">Total</span>
                <span className="text-xl font-bold text-white">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
