"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { careSchema } from "@/lib/validations";
import { getRequiredSession, assertCanEdit } from "@/lib/auth-utils";

export async function getCareRecords(petId: string) {
  return prisma.careRecord.findMany({
    where: { petId },
    orderBy: { date: "desc" },
  });
}

export async function createCareRecord(
  petId: string,
  _prev: unknown,
  formData: FormData
): Promise<{ error?: Record<string, string[]> } | void> {
  const session = await getRequiredSession();
  await assertCanEdit(session.user.id, petId);
  const raw = Object.fromEntries(formData);
  const parsed = careSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }
  const { type, date, durationMins, notes } = parsed.data;
  await prisma.careRecord.create({
    data: {
      petId,
      type,
      date: new Date(date),
      durationMins: durationMins ? Number(durationMins) : null,
      notes: notes || null,
    },
  });
  revalidatePath(`/pets/${petId}/care`);
  redirect(`/pets/${petId}/care`);
}

export async function deleteCareRecord(id: string, petId: string) {
  const session = await getRequiredSession();
  await assertCanEdit(session.user.id, petId);
  await prisma.careRecord.delete({ where: { id } });
  revalidatePath(`/pets/${petId}/care`);
}
