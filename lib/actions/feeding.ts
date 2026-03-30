"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { feedPlanSchema, feedRecordSchema } from "@/lib/validations";
import { getRequiredSession, assertCanEdit } from "@/lib/auth-utils";

export async function getActiveFeedPlan(petId: string) {
  return prisma.feedPlan.findFirst({
    where: { petId, isActive: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getFeedRecords(petId: string) {
  return prisma.feedRecord.findMany({
    where: { petId },
    orderBy: { date: "desc" },
  });
}

export async function createFeedPlan(
  petId: string,
  _prev: unknown,
  formData: FormData
): Promise<{ error?: Record<string, string[]> } | void> {
  const session = await getRequiredSession();
  await assertCanEdit(session.user.id, petId);
  const raw = Object.fromEntries(formData);
  const parsed = feedPlanSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }
  await prisma.feedPlan.updateMany({
    where: { petId, isActive: true },
    data: { isActive: false },
  });
  await prisma.feedPlan.create({
    data: {
      petId,
      foodName: parsed.data.foodName,
      brand: parsed.data.brand || null,
      amountGrams: Number(parsed.data.amountGrams),
      frequency: parsed.data.frequency,
      notes: parsed.data.notes || null,
    },
  });
  revalidatePath(`/pets/${petId}/feeding`);
  redirect(`/pets/${petId}/feeding`);
}

export async function createFeedRecord(
  petId: string,
  _prev: unknown,
  formData: FormData
): Promise<{ error?: Record<string, string[]> } | void> {
  const session = await getRequiredSession();
  await assertCanEdit(session.user.id, petId);
  const raw = Object.fromEntries(formData);
  const parsed = feedRecordSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }
  const { foodName, date, amountGrams, mealTime, notes } = parsed.data;
  await prisma.feedRecord.create({
    data: {
      petId,
      foodName,
      date: new Date(date),
      amountGrams: Number(amountGrams),
      mealTime: mealTime || null,
      notes: notes || null,
    },
  });
  revalidatePath(`/pets/${petId}/feeding`);
  redirect(`/pets/${petId}/feeding`);
}

export async function deleteFeedRecord(id: string, petId: string) {
  const session = await getRequiredSession();
  await assertCanEdit(session.user.id, petId);
  await prisma.feedRecord.delete({ where: { id } });
  revalidatePath(`/pets/${petId}/feeding`);
}
