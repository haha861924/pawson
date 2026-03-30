"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { weightRecordSchema } from "@/lib/validations";
import { getRequiredSession, assertCanEdit } from "@/lib/auth-utils";

export async function getWeightRecords(petId: string) {
  return prisma.weightRecord.findMany({
    where: { petId },
    orderBy: { date: "desc" },
  });
}

export async function createWeightRecord(
  petId: string,
  _prev: unknown,
  formData: FormData
): Promise<{ error?: Record<string, string[]> } | void> {
  const session = await getRequiredSession();
  await assertCanEdit(session.user.id, petId);

  const raw = Object.fromEntries(formData);
  const parsed = weightRecordSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const { weight, date, notes } = parsed.data;

  await prisma.weightRecord.create({
    data: {
      petId,
      weight,
      date: new Date(date),
      notes: notes || null,
    },
  });

  revalidatePath(`/pets/${petId}/weight`);
  redirect(`/pets/${petId}/weight`);
}

export async function deleteWeightRecord(id: string, petId: string) {
  const session = await getRequiredSession();
  await assertCanEdit(session.user.id, petId);

  await prisma.weightRecord.delete({ where: { id } });
  revalidatePath(`/pets/${petId}/weight`);
}
