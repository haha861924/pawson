"use client";

import { format } from "date-fns";
import { DeleteButton } from "@/components/shared/DeleteButton";
import { deleteExpense } from "@/lib/actions/expenses";
import { EXPENSE_CATEGORIES, getLabel } from "@/lib/types";
import { cn } from "@/lib/utils";
import { DogAvatar } from "@/components/dogs/DogAvatar";

const categoryColor: Record<string, string> = {
  food: "bg-green-100 text-green-800",
  vet: "bg-red-100 text-red-800",
  grooming: "bg-purple-100 text-purple-800",
  supplies: "bg-blue-100 text-blue-800",
  medication: "bg-orange-100 text-orange-800",
  training: "bg-yellow-100 text-yellow-800",
  other: "bg-gray-100 text-gray-800",
};

interface Expense {
  id: string;
  dogId: string;
  category: string;
  amount: number;
  description: string;
  date: Date;
  notes: string | null;
  dog: { name: string; avatarUrl: string | null } | null;
}

export function ExpenseList({
  expenses,
  showDog = false,
}: {
  expenses: Expense[];
  showDog?: boolean;
}) {
  return (
    <div className="space-y-2">
      {expenses.map((expense) => (
        <div key={expense.id} className="flex items-start gap-3 p-4 rounded-lg border bg-card">
          {showDog && expense.dog && (
            <DogAvatar name={expense.dog.name} avatarUrl={expense.dog.avatarUrl} size="sm" />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                  categoryColor[expense.category] ?? categoryColor.other
                )}
              >
                {getLabel(EXPENSE_CATEGORIES, expense.category)}
              </span>
              <span className="font-semibold text-sm">
                NT$ {expense.amount.toLocaleString()}
              </span>
              {showDog && expense.dog && (
                <span className="text-xs text-muted-foreground">{expense.dog.name}</span>
              )}
            </div>
            <p className="text-sm mt-0.5">{expense.description}</p>
            <p className="text-xs text-muted-foreground">
              {format(new Date(expense.date), "yyyy/MM/dd")}
            </p>
            {expense.notes && (
              <p className="text-xs text-muted-foreground mt-0.5">{expense.notes}</p>
            )}
          </div>
          <DeleteButton
            onDelete={async () => {
              await deleteExpense(expense.id, expense.dogId);
            }}
          />
        </div>
      ))}
    </div>
  );
}
