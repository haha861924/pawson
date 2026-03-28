"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { dogSchema } from "@/lib/validations";

export async function getDogs() {
  return prisma.dog.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { careRecords: true, healthRecords: true, expenses: true },
      },
    },
  });
}

export async function getDogById(id: string) {
  return prisma.dog.findUnique({ where: { id } });
}

export async function createDog(
  _prev: unknown,
  formData: FormData
): Promise<{ error?: Record<string, string[]> } | void> {
  const raw = Object.fromEntries(formData);
  const parsed = dogSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }
  const { name, breed, dob, weight, sex, notes } = parsed.data;
  const dog = await prisma.dog.create({
    data: {
      name,
      breed: breed || null,
      dob: dob ? new Date(dob) : null,
      weight: weight ? Number(weight) : null,
      sex: sex || null,
      notes: notes || null,
    },
  });
  revalidatePath("/dogs");
  redirect(`/dogs/${dog.id}`);
}

export async function updateDog(
  id: string,
  _prev: unknown,
  formData: FormData
): Promise<{ error?: Record<string, string[]> } | void> {
  const raw = Object.fromEntries(formData);
  const parsed = dogSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }
  const { name, breed, dob, weight, sex, notes } = parsed.data;
  await prisma.dog.update({
    where: { id },
    data: {
      name,
      breed: breed || null,
      dob: dob ? new Date(dob) : null,
      weight: weight ? Number(weight) : null,
      sex: sex || null,
      notes: notes || null,
    },
  });
  revalidatePath(`/dogs/${id}`);
  redirect(`/dogs/${id}`);
}

export async function deleteDog(id: string) {
  // SQLite doesn't enforce foreign keys by default, so manually cascade-delete
  await prisma.expense.deleteMany({ where: { dogId: id } });
  await prisma.healthRecord.deleteMany({ where: { dogId: id } });
  await prisma.feedRecord.deleteMany({ where: { dogId: id } });
  await prisma.feedPlan.deleteMany({ where: { dogId: id } });
  await prisma.careRecord.deleteMany({ where: { dogId: id } });
  await prisma.dog.delete({ where: { id } });
  revalidatePath("/dogs");
  redirect("/dogs");
}
