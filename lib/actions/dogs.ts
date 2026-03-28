"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { dogSchema } from "@/lib/validations";
import { getRequiredSession, assertCanEdit, assertOwner } from "@/lib/auth-utils";

export async function getDogs() {
  const session = await getRequiredSession();
  const userId = session.user.id;
  const memberships = await prisma.dogMember.findMany({
    where: { userId, canView: true },
    include: {
      dog: {
        include: {
          _count: {
            select: { careRecords: true, healthRecords: true, expenses: true },
          },
        },
      },
    },
    orderBy: { dog: { createdAt: "desc" } },
  });
  return memberships.map((m) => ({ ...m.dog, role: m.role }));
}

export async function getDogById(id: string) {
  return prisma.dog.findUnique({ where: { id } });
}

export async function createDog(
  _prev: unknown,
  formData: FormData
): Promise<{ error?: Record<string, string[]> } | void> {
  const session = await getRequiredSession();
  const userId = session.user.id;

  const raw = Object.fromEntries(formData);
  const parsed = dogSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }
  const { name, breed, dob, weight, sex, notes } = parsed.data;
  const avatarUrl = (raw.avatarUrl as string) || null;
  const dog = await prisma.dog.create({
    data: {
      name,
      breed: breed || null,
      dob: dob ? new Date(dob) : null,
      weight: weight ? Number(weight) : null,
      sex: sex || null,
      notes: notes || null,
      avatarUrl,
      members: {
        create: { userId, role: "OWNER", canView: true, canEdit: true },
      },
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
  const session = await getRequiredSession();
  await assertCanEdit(session.user.id, id);

  const raw = Object.fromEntries(formData);
  const parsed = dogSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }
  const { name, breed, dob, weight, sex, notes } = parsed.data;
  const avatarUrl = (raw.avatarUrl as string) || null;
  await prisma.dog.update({
    where: { id },
    data: {
      name,
      breed: breed || null,
      dob: dob ? new Date(dob) : null,
      weight: weight ? Number(weight) : null,
      sex: sex || null,
      notes: notes || null,
      avatarUrl,
    },
  });
  revalidatePath(`/dogs/${id}`);
  redirect(`/dogs/${id}`);
}

async function _deleteDogById(id: string) {
  await prisma.expense.deleteMany({ where: { dogId: id } });
  await prisma.healthRecord.deleteMany({ where: { dogId: id } });
  await prisma.feedRecord.deleteMany({ where: { dogId: id } });
  await prisma.feedPlan.deleteMany({ where: { dogId: id } });
  await prisma.careRecord.deleteMany({ where: { dogId: id } });
  await prisma.feedReview.deleteMany({ where: { dogId: id } });
  await prisma.dog.delete({ where: { id } });
}

export async function batchDeleteDogs(ids: string[]) {
  const session = await getRequiredSession();
  for (const id of ids) {
    await assertOwner(session.user.id, id);
    await _deleteDogById(id);
  }
  revalidatePath("/dogs");
}

export async function deleteDog(id: string) {
  const session = await getRequiredSession();
  await assertOwner(session.user.id, id);
  await _deleteDogById(id);
  revalidatePath("/dogs");
  redirect("/dogs");
}
