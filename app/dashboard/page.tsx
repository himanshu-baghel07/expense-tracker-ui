import CategoryBreakdown from "@/components/dashboard/CategoryBreakdown";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ExpenseList from "@/components/dashboard/ExpenseList";
import ExpenseSummary from "@/components/dashboard/ExpenseSummary";
import MonthlyTrend from "@/components/dashboard/MonthlyTrend";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-black">
      <DashboardHeader />

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">
        <div className="space-y-6 sm:space-y-8">
          {/* Summary Cards */}
          <ExpenseSummary />

          {/* Charts and Expenses */}
          <div className="grid gap-6 lg:grid-cols-3">
            <CategoryBreakdown />
            <MonthlyTrend />
          </div>

          {/* Expenses List */}
          <ExpenseList />
        </div>
      </main>
    </div>
  );
}
