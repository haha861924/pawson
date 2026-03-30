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

  // 同步更新寵物的最新體重
  await prisma.pet.update({
    where: { id: petId },
    data: { weight },
  });

  revalidatePath(`/pets/${petId}/weight`);
  revalidatePath(`/pets/${petId}`);
  redirect(`/pets/${petId}/weight`);
}

export async function deleteWeightRecord(id: string, petId: string) {
  const session = await getRequiredSession();
  await assertCanEdit(session.user.id, petId);

  await prisma.weightRecord.delete({ where: { id } });

  // 刪除後查詢最新一筆體重記錄，同步更新 Pet.weight
  const latest = await prisma.weightRecord.findFirst({
    where: { petId },
    orderBy: { date: "desc" },
  });

  await prisma.pet.update({
    where: { id: petId },
    data: { weight: latest?.weight ?? null },
  });

  revalidatePath(`/pets/${petId}/weight`);
  revalidatePath(`/pets/${petId}`);
}
