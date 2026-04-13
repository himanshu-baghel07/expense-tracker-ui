"use client";

import { getExpenseSummary } from "@/lib/actions/auth.action";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Calendar, CreditCard, DollarSign, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

interface SummaryData {
  totalAmount: number;
  count: number;
  average: number;
}

export default function ExpenseSummary() {
  const [summary, setSummary] = useState<SummaryData>({
    totalAmount: 0,
    count: 0,
    average: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    setIsLoading(true);
    const [result] = await Promise.allSettled([getExpenseSummary()]);

    if (result.status === "fulfilled" && result.value.success) {
      setSummary(
        result.value.data.data || { totalAmount: 0, count: 0, average: 0 },
      );
    }
    setIsLoading(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-800 rounded w-24"></div>
              <div className="h-8 w-8 bg-gray-800 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-800 rounded w-32 mb-2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: "Total Expenses",
      value: formatCurrency(summary?.totalAmount ?? 0),
      icon: DollarSign,
      color: "from-blue-600 to-blue-700",
      iconBg: "bg-blue-600/20",
    },
    {
      title: "Transaction Count",
      value: (summary?.count ?? 0).toString(),
      icon: CreditCard,
      color: "from-purple-600 to-purple-700",
      iconBg: "bg-purple-600/20",
    },
    {
      title: "Average Expense",
      value: formatCurrency(summary?.average ?? 0),
      icon: TrendingUp,
      color: "from-green-600 to-green-700",
      iconBg: "bg-green-600/20",
    },
    {
      title: "This Month",
      value: new Date().toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
      icon: Calendar,
      color: "from-orange-600 to-orange-700",
      iconBg: "bg-orange-600/20",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="relative overflow-hidden hover:scale-105 transition-transform duration-200"
        >
          {/* Gradient background */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5`}
          ></div>

          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-gray-400">
              {stat.title}
            </CardTitle>
            <div className={`${stat.iconBg} p-2 rounded-lg`}>
              <stat.icon className={`h-4 w-4 text-white`} />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            {index < 3 && (
              <p className="text-xs text-gray-500 mt-1">All time statistics</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
