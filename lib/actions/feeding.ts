"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { feedPlanSchema, feedRecordSchema } from "@/lib/validations";

export async function getActiveFeedPlan(dogId: string) {
  return prisma.feedPlan.findFirst({
    where: { dogId, isActive: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getFeedRecordsByDog(dogId: string) {
  return prisma.feedRecord.findMany({
    where: { dogId },
    orderBy: { date: "desc" },
  });
}

export async function createFeedPlan(
  dogId: string,
  _prev: unknown,
  formData: FormData
): Promise<{ error?: Record<string, string[]> } | void> {
  const raw = Object.fromEntries(formData);
  const parsed = feedPlanSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }
  await prisma.feedPlan.updateMany({
    where: { dogId, isActive: true },
    data: { isActive: false },
  });
  await prisma.feedPlan.create({
    data: {
      dogId,
      foodName: parsed.data.foodName,
      brand: parsed.data.brand || null,
      amountGrams: Number(parsed.data.amountGrams),
      frequency: parsed.data.frequency,
      notes: parsed.data.notes || null,
    },
  });
  revalidatePath(`/dogs/${dogId}/feeding`);
  redirect(`/dogs/${dogId}/feeding`);
}

export async function createFeedRecord(
  dogId: string,
  _prev: unknown,
  formData: FormData
): Promise<{ error?: Record<string, string[]> } | void> {
  const raw = Object.fromEntries(formData);
  const parsed = feedRecordSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }
  const { foodName, date, amountGrams, mealTime, notes } = parsed.data;
  await prisma.feedRecord.create({
    data: {
      dogId,
      foodName,
      date: new Date(date),
      amountGrams: Number(amountGrams),
      mealTime: mealTime || null,
      notes: notes || null,
    },
  });
  revalidatePath(`/dogs/${dogId}/feeding`);
  redirect(`/dogs/${dogId}/feeding`);
}

export async function deleteFeedRecord(id: string, dogId: string) {
  await prisma.feedRecord.delete({ where: { id } });
  revalidatePath(`/dogs/${dogId}/feeding`);
}
