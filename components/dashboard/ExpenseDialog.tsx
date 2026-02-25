"use client";

import { useIsMobile } from "@/hooks/useMediaQuery";
import {
  createExpense,
  getCategories,
  updateExpense,
} from "@/lib/actions/auth.action";
import { Button } from "@/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/ui/sheet";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Expense {
  _id: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
}

interface ExpenseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  expense?: Expense | null;
  onSuccess: () => void;
}

const FALLBACK_CATEGORIES = [
  "Food",
  "Transport",
  "Entertainment",
  "Shopping",
  "Healthcare",
  "Utilities",
  "Education",
  "Other",
];

export default function ExpenseDialog({
  isOpen,
  onClose,
  expense,
  onSuccess,
}: ExpenseDialogProps) {
  const [amount, setAmount] = useState(expense?.amount.toString() || "");
  const [category, setCategory] = useState(expense?.category || "Food");
  const [categories, setCategories] = useState<string[]>(FALLBACK_CATEGORIES);
  const [date, setDate] = useState(
    expense?.date
      ? new Date(expense.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
  );
  const [description, setDescription] = useState(expense?.description || "");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    getCategories().then((res) => {
      if (res.success && res.data?.data && Array.isArray(res.data.data)) {
        const names = res.data.data.map(
          (c: { name?: string; _id?: string }) => c.name ?? c._id ?? "",
        ).filter(Boolean);
        if (names.length) setCategories(names);
      }
    });
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const expenseData = {
        amount: parseFloat(amount),
        category,
        date: new Date(date).toISOString(),
        description: description || undefined,
      };

      const result = expense
        ? await updateExpense(expense._id, expenseData)
        : await createExpense(expenseData);

      if (result.success) {
        toast.success(
          expense
            ? "Expense updated successfully!"
            : "Expense created successfully!",
        );
        onSuccess();
        onClose();
        // Reset form
        if (!expense) {
          setAmount("");
          setCategory(categories[0] ?? "Food");
          setDate(new Date().toISOString().split("T")[0]);
          setDescription("");
        }
      } else {
        toast.error(result.error || "Failed to save expense");
      }
    } catch (error) {
      toast.error("An error occurred while saving expense");
    } finally {
      setIsLoading(false);
    }
  };

  const isMobile = useIsMobile();
  const title = expense ? "Edit Expense" : "Add New Expense";
  const subtitle = expense
    ? "Update your expense details"
    : "Add a new expense to track your spending";

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="amount">Amount *</Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="45.99"
          min="0"
          step="0.01"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="flex h-10 w-full rounded-md border border-gray-800 bg-black px-3 py-2 text-base ring-offset-black file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-white"
          required
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="date">Date *</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Lunch at restaurant"
        />
      </div>
      <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
          className="border-gray-800 hover:bg-gray-800 order-2 sm:order-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={isLoading}
          disabled={isLoading}
          className="order-1 sm:order-2"
        >
          {expense ? "Update" : "Create"} Expense
        </Button>
      </div>
    </form>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent
          side="bottom"
          className="sm:max-w-[500px] sm:mx-auto sm:rounded-t-2xl"
        >
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
            <SheetDescription>{subtitle}</SheetDescription>
          </SheetHeader>
          {formContent}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{subtitle}</DialogDescription>
        </DialogHeader>
        {formContent}
      </DialogContent>
    </Dialog>
  );
}
