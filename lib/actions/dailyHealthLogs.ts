"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { dailyHealthLogSchema } from "@/lib/validations";
import { getRequiredSession, assertCanEdit } from "@/lib/auth-utils";

export async function getDailyHealthLogs(petId: string) {
  return prisma.dailyHealthLog.findMany({
    where: { petId },
    orderBy: { date: "desc" },
  });
}

export async function getWeightRecords(petId: string) {
  return prisma.weightRecord.findMany({
    where: { petId },
    orderBy: { date: "asc" },
  });
}

export async function createDailyHealthLog(
  petId: string,
  _prev: unknown,
  formData: FormData
): Promise<{ error?: Record<string, string[]> } | void> {
  const session = await getRequiredSession();
  await assertCanEdit(session.user.id, petId);

  const raw = Object.fromEntries(formData);
  const parsed = dailyHealthLogSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { date, weight, appetite, stoolCondition, mood, hasVomiting, temperature, notes } = parsed.data;

  await prisma.dailyHealthLog.create({
    data: {
      petId,
      date: new Date(date),
      weight: weight || null,
      appetite: appetite || null,
      stoolCondition: stoolCondition || null,
      mood: mood || null,
      hasVomiting,
      temperature: temperature || null,
      notes: notes || null,
    },
  });

  revalidatePath(`/pets/${petId}/diary`);
  redirect(`/pets/${petId}/diary`);
}

export async function deleteDailyHealthLog(id: string, petId: string) {
  const session = await getRequiredSession();
  await assertCanEdit(session.user.id, petId);

  await prisma.dailyHealthLog.delete({ where: { id } });
  revalidatePath(`/pets/${petId}/diary`);
}
