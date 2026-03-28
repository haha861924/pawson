"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { healthSchema } from "@/lib/validations";

export async function getHealthRecordsByDog(dogId: string) {
  return prisma.healthRecord.findMany({
    where: { dogId },
    orderBy: { date: "desc" },
  });
}

export async function getUpcomingHealthDue(days = 30) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() + days);
  return prisma.healthRecord.findMany({
    where: {
      nextDueDate: { lte: cutoff },
    },
    include: { dog: true },
    orderBy: { nextDueDate: "asc" },
  });
}

export async function createHealthRecord(
  dogId: string,
  _prev: unknown,
  formData: FormData
): Promise<{ error?: Record<string, string[]> } | void> {
  const raw = Object.fromEntries(formData);
  const parsed = healthSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }
  const { type, title, date, description, vetName, nextDueDate } = parsed.data;
  await prisma.healthRecord.create({
    data: {
      dogId,
      type,
      title,
      date: new Date(date),
      description: description || null,
      vetName: vetName || null,
      nextDueDate: nextDueDate ? new Date(nextDueDate) : null,
    },
  });
  revalidatePath(`/dogs/${dogId}/health`);
  redirect(`/dogs/${dogId}/health`);
}

export async function deleteHealthRecord(id: string, dogId: string) {
  await prisma.healthRecord.delete({ where: { id } });
  revalidatePath(`/dogs/${dogId}/health`);
}
