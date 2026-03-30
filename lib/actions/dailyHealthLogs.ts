"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { dailyHealthLogSchema } from "@/lib/validations";
import { getRequiredSession, assertCanEdit } from "@/lib/auth-utils";

export async function getDailyHealthLogs(dogId: string) {
  return prisma.dailyHealthLog.findMany({
    where: { dogId },
    orderBy: { date: "desc" },
  });
}

export async function getWeightRecords(dogId: string) {
  return prisma.weightRecord.findMany({
    where: { dogId },
    orderBy: { date: "asc" },
  });
}

export async function createDailyHealthLog(
  dogId: string,
  _prev: unknown,
  formData: FormData
): Promise<{ error?: Record<string, string[]> } | void> {
  const session = await getRequiredSession();
  await assertCanEdit(session.user.id, dogId);

  const raw = Object.fromEntries(formData);
  const parsed = dailyHealthLogSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { date, weight, appetite, stoolCondition, mood, hasVomiting, temperature, notes } = parsed.data;

  await prisma.dailyHealthLog.create({
    data: {
      dogId,
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

  revalidatePath(`/dogs/${dogId}/diary`);
  redirect(`/dogs/${dogId}/diary`);
}

export async function deleteDailyHealthLog(id: string, dogId: string) {
  const session = await getRequiredSession();
  await assertCanEdit(session.user.id, dogId);

  await prisma.dailyHealthLog.delete({ where: { id } });
  revalidatePath(`/dogs/${dogId}/diary`);
}
