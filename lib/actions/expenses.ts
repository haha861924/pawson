"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { expenseSchema } from "@/lib/validations";
import { getRequiredSession, assertCanEdit } from "@/lib/auth-utils";

export async function getExpenses(petId?: string, breed?: string) {
  const session = await getRequiredSession();
  const userId = session.user.id;
  return prisma.expense.findMany({
    where: {
      pet: { members: { some: { userId, canView: true } } },
      ...(petId ? { petId } : {}),
      ...(breed ? { pet: { breed } } : {}),
    },
    include: { pet: true },
    orderBy: { date: "desc" },
  });
}

export async function getExpenseSummary(petId?: string, breed?: string) {
  const session = await getRequiredSession();
  const userId = session.user.id;
  const expenses = await prisma.expense.findMany({
    where: {
      pet: { members: { some: { userId, canView: true } } },
      ...(petId ? { petId } : {}),
      ...(breed ? { pet: { breed } } : {}),
    },
    select: { amount: true, category: true, date: true },
  });
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const byCategory = expenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});
  const byMonth = expenses.reduce<Record<string, number>>((acc, e) => {
    const key = `${new Date(e.date).getFullYear()}/${String(new Date(e.date).getMonth() + 1).padStart(2, "0")}`;
    acc[key] = (acc[key] || 0) + e.amount;
    return acc;
  }, {});
  return { total, byCategory, byMonth };
}

export async function getBreeds() {
  const session = await getRequiredSession();
  const userId = session.user.id;
  const pets = await prisma.pet.findMany({
    where: { breed: { not: null }, members: { some: { userId, canView: true } } },
    select: { breed: true },
    distinct: ["breed"],
    orderBy: { breed: "asc" },
  });
  return pets.map((d) => d.breed!).filter(Boolean);
}

export async function createExpense(
  _prev: unknown,
  formData: FormData
): Promise<{ error?: Record<string, string[]> } | void> {
  const session = await getRequiredSession();
  const raw = Object.fromEntries(formData);
  const parsed = expenseSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }
  const { petId, category, amount, description, date, notes, invoiceNumber } = parsed.data;
  await assertCanEdit(session.user.id, petId);
  await prisma.expense.create({
    data: {
      petId,
      category,
      amount: Number(amount),
      description,
      date: new Date(date),
      notes: notes || null,
      invoiceNumber: invoiceNumber || null,
    },
  });
  const referer = (raw._referer as string) || `/pets/${petId}/expenses`;
  revalidatePath(`/pets/${petId}/expenses`);
  revalidatePath("/expenses");
  redirect(referer);
}

export async function deleteExpense(id: string, petId: string) {
  const session = await getRequiredSession();
  await assertCanEdit(session.user.id, petId);
  await prisma.expense.delete({ where: { id } });
  revalidatePath(`/pets/${petId}/expenses`);
  revalidatePath("/expenses");
}
