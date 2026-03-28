"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { expenseSchema } from "@/lib/validations";

export async function getExpenses(dogId?: string) {
  return prisma.expense.findMany({
    where: dogId ? { dogId } : undefined,
    include: { dog: true },
    orderBy: { date: "desc" },
  });
}

export async function getExpenseSummary(dogId?: string) {
  const expenses = await prisma.expense.findMany({
    where: dogId ? { dogId } : undefined,
    select: { amount: true, category: true },
  });
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const byCategory = expenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});
  return { total, byCategory };
}

export async function createExpense(
  _prev: unknown,
  formData: FormData
): Promise<{ error?: Record<string, string[]> } | void> {
  const raw = Object.fromEntries(formData);
  const parsed = expenseSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }
  const { dogId, category, amount, description, date, notes } = parsed.data;
  await prisma.expense.create({
    data: {
      dogId,
      category,
      amount: Number(amount),
      description,
      date: new Date(date),
      notes: notes || null,
    },
  });
  const referer = (raw._referer as string) || `/dogs/${dogId}/expenses`;
  revalidatePath(`/dogs/${dogId}/expenses`);
  revalidatePath("/expenses");
  redirect(referer);
}

export async function deleteExpense(id: string, dogId: string) {
  await prisma.expense.delete({ where: { id } });
  revalidatePath(`/dogs/${dogId}/expenses`);
  revalidatePath("/expenses");
}
