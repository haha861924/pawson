"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { careSchema } from "@/lib/validations";

export async function getCareRecordsByDog(dogId: string) {
  return prisma.careRecord.findMany({
    where: { dogId },
    orderBy: { date: "desc" },
  });
}

export async function createCareRecord(
  dogId: string,
  _prev: unknown,
  formData: FormData
): Promise<{ error?: Record<string, string[]> } | void> {
  const raw = Object.fromEntries(formData);
  const parsed = careSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }
  const { type, date, durationMins, notes } = parsed.data;
  await prisma.careRecord.create({
    data: {
      dogId,
      type,
      date: new Date(date),
      durationMins: durationMins ? Number(durationMins) : null,
      notes: notes || null,
    },
  });
  revalidatePath(`/dogs/${dogId}/care`);
  redirect(`/dogs/${dogId}/care`);
}

export async function deleteCareRecord(id: string, dogId: string) {
  await prisma.careRecord.delete({ where: { id } });
  revalidatePath(`/dogs/${dogId}/care`);
}
