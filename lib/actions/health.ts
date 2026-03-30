"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { addMonths } from "date-fns";
import { prisma } from "@/lib/prisma";
import { healthSchema } from "@/lib/validations";
import { REMINDER_INTERVALS } from "@/lib/types";
import { getRequiredSession, assertCanEdit } from "@/lib/auth-utils";

export async function getHealthRecords(petId: string) {
  return prisma.healthRecord.findMany({
    where: { petId },
    orderBy: { date: "desc" },
  });
}

export async function getUpcomingHealthDue(userId: string, days = 30) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() + days);
  return prisma.healthRecord.findMany({
    where: {
      nextDueDate: { lte: cutoff },
      pet: { members: { some: { userId, canView: true } } },
    },
    include: { pet: true },
    orderBy: { nextDueDate: "asc" },
  });
}

export async function createHealthRecord(
  petId: string,
  _prev: unknown,
  formData: FormData
): Promise<{ error?: Record<string, string[]> } | void> {
  const session = await getRequiredSession();
  await assertCanEdit(session.user.id, petId);
  const raw = Object.fromEntries(formData);
  const parsed = healthSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }
  const { type, title, date, description, vetName, nextDueDate, reminderInterval } = parsed.data;

  // Auto-calculate nextDueDate from reminderInterval if no manual date provided
  let computedNextDueDate: Date | null = null;
  if (nextDueDate) {
    computedNextDueDate = new Date(nextDueDate);
  } else if (reminderInterval) {
    const interval = REMINDER_INTERVALS.find((r) => r.value === reminderInterval);
    if (interval) {
      computedNextDueDate = addMonths(new Date(date), interval.months);
    }
  }

  await prisma.healthRecord.create({
    data: {
      petId,
      type,
      title,
      date: new Date(date),
      description: description || null,
      vetName: vetName || null,
      nextDueDate: computedNextDueDate,
      reminderInterval: reminderInterval || null,
    },
  });
  revalidatePath(`/pets/${petId}/health`);
  redirect(`/pets/${petId}/health`);
}

export async function deleteHealthRecord(id: string, petId: string) {
  const session = await getRequiredSession();
  await assertCanEdit(session.user.id, petId);
  await prisma.healthRecord.delete({ where: { id } });
  revalidatePath(`/pets/${petId}/health`);
}
