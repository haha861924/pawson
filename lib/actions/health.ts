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
  const memberFilter = { pet: { members: { some: { userId, canView: true } } } };

  const [byNextDue, byDate] = await Promise.all([
    // Records with nextDueDate within range (including overdue)
    prisma.healthRecord.findMany({
      where: { nextDueDate: { lte: cutoff }, ...memberFilter },
      include: { pet: true },
    }),
    // Records with date in the future within range (no nextDueDate needed)
    prisma.healthRecord.findMany({
      where: { date: { gt: new Date(), lte: cutoff }, nextDueDate: null, ...memberFilter },
      include: { pet: true },
    }),
  ]);

  // Merge, deduplicate, and sort by effective due date
  const map = new Map<string, (typeof byNextDue)[number]>();
  for (const r of [...byNextDue, ...byDate]) map.set(r.id, r);
  return Array.from(map.values()).sort((a, b) => {
    const da = a.nextDueDate ?? a.date;
    const db = b.nextDueDate ?? b.date;
    return new Date(da).getTime() - new Date(db).getTime();
  });
}

export async function getHealthRecord(id: string) {
  return prisma.healthRecord.findUnique({ where: { id } });
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

export async function updateHealthRecord(
  id: string,
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

  let computedNextDueDate: Date | null = null;
  if (nextDueDate) {
    computedNextDueDate = new Date(nextDueDate);
  } else if (reminderInterval) {
    const interval = REMINDER_INTERVALS.find((r) => r.value === reminderInterval);
    if (interval) {
      computedNextDueDate = addMonths(new Date(date), interval.months);
    }
  }

  await prisma.healthRecord.update({
    where: { id },
    data: {
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
