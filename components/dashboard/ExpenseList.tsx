"use client";

import { deleteExpense, getAllExpenses } from "@/lib/actions/auth.action";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Calendar, DollarSign, Edit, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ExpenseDialog from "./ExpenseDialog";

interface Expense {
  _id: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  Food: "bg-orange-600",
  Transport: "bg-blue-600",
  Entertainment: "bg-purple-600",
  Shopping: "bg-pink-600",
  Healthcare: "bg-red-600",
  Utilities: "bg-green-600",
  Education: "bg-indigo-600",
  Other: "bg-gray-600",
};

export default function ExpenseList() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchExpenses();
  }, [currentPage]);

  const fetchExpenses = async () => {
    setIsLoading(true);
    const [result] = await Promise.allSettled([
      getAllExpenses({
        page: currentPage,
        limit: 10,
        sortBy: "date",
        sortOrder: "desc",
      }),
    ]);

    if (result.status === "fulfilled" && result.value.success) {
      setExpenses(result.value.data.data || []);
      setTotalPages(result.value.data.totalPages || 1);
    } else {
      toast.error("Failed to fetch expenses");
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    const result = await deleteExpense(id);
    if (result.success) {
      toast.success("Expense deleted successfully!");
      fetchExpenses();
    } else {
      toast.error(result.error || "Failed to delete expense");
    }
  };

  const handleEdit = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedExpense(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <>
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-xl sm:text-2xl">
              Recent Expenses
            </CardTitle>
            <Button
              onClick={() => setIsDialogOpen(true)}
              size="sm"
              className="w-full sm:w-auto shrink-0"
            >
              <Plus className="h-4 w-4 shrink-0" />
              Add Expense
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-800 border-t-blue-600"></div>
            </div>
          ) : expenses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4 w-full">
              <DollarSign className="h-12 w-12 text-gray-600 mb-4 shrink-0" />
              <p className="text-gray-400 mb-4">No expenses yet</p>
              <Button
                onClick={() => setIsDialogOpen(true)}
                size="sm"
                className="w-full sm:w-auto max-w-xs mx-auto"
              >
                <Plus className="h-4 w-4 shrink-0" />
                Add Your First Expense
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {expenses.map((expense) => (
                  <div
                    key={expense._id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-lg border border-gray-800 bg-black/30 hover:bg-black/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <div
                        className={`h-10 w-10 sm:h-12 sm:w-12 rounded-full shrink-0 ${CATEGORY_COLORS[expense.category] || "bg-gray-600"} flex items-center justify-center text-white font-semibold text-xs sm:text-base`}
                      >
                        {expense.category.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-semibold text-white truncate">
                            {expense.description || expense.category}
                          </h3>
                          <Badge
                            variant="secondary"
                            className="text-xs shrink-0"
                          >
                            {expense.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Calendar className="h-3 w-3 shrink-0" />
                          <span>{formatDate(expense.date)}</span>
                        </div>
                      </div>
                      <div className="text-left sm:text-right shrink-0">
                        <p className="text-lg sm:text-xl font-bold text-white">
                          {formatCurrency(expense.amount)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 justify-end sm:justify-start sm:ml-4 shrink-0 border-t border-gray-800 pt-3 sm:border-0 sm:pt-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(expense)}
                        className="border-gray-800 hover:bg-gray-800"
                        aria-label="Edit expense"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(expense._id)}
                        className="border-red-900 text-red-500 hover:bg-red-950"
                        aria-label="Delete expense"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="border-gray-800 hover:bg-gray-800 shrink-0"
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-400 w-full text-center sm:w-auto">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="border-gray-800 hover:bg-gray-800 shrink-0"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <ExpenseDialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        expense={selectedExpense}
        onSuccess={fetchExpenses}
      />
    </>
  );
}
