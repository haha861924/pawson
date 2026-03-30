"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { weightRecordSchema } from "@/lib/validations";
import { getRequiredSession, assertCanEdit } from "@/lib/auth-utils";

export async function getWeightRecords(dogId: string) {
  return prisma.weightRecord.findMany({
    where: { dogId },
    orderBy: { date: "desc" },
  });
}

export async function createWeightRecord(
  dogId: string,
  _prev: unknown,
  formData: FormData
): Promise<{ error?: Record<string, string[]> } | void> {
  const session = await getRequiredSession();
  await assertCanEdit(session.user.id, dogId);

  const raw = Object.fromEntries(formData);
  const parsed = weightRecordSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { weight, date, notes } = parsed.data;

  await prisma.weightRecord.create({
    data: {
      dogId,
      weight,
      date: new Date(date),
      notes: notes || null,
    },
  });

  revalidatePath(`/dogs/${dogId}/weight`);
  redirect(`/dogs/${dogId}/weight`);
}

export async function deleteWeightRecord(id: string, dogId: string) {
  const session = await getRequiredSession();
  await assertCanEdit(session.user.id, dogId);

  await prisma.weightRecord.delete({ where: { id } });
  revalidatePath(`/dogs/${dogId}/weight`);
}
