"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { petSchema } from "@/lib/validations";
import { getRequiredSession, assertCanEdit, assertOwner } from "@/lib/auth-utils";

export async function getPets() {
  const session = await getRequiredSession();
  const userId = session.user.id;
  const memberships = await prisma.petMember.findMany({
    where: { userId, canView: true },
    include: {
      pet: {
        include: {
          _count: {
            select: { careRecords: true, healthRecords: true, expenses: true },
          },
        },
      },
    },
    orderBy: { pet: { createdAt: "desc" } },
  });
  return memberships.map((m) => ({ ...m.pet, role: m.role }));
}

export async function getPetById(id: string) {
  return prisma.pet.findUnique({ where: { id } });
}

export async function createPet(
  _prev: unknown,
  formData: FormData
): Promise<{ error?: Record<string, string[]> } | void> {
  const session = await getRequiredSession();
  const userId = session.user.id;

  const raw = Object.fromEntries(formData);
  const parsed = petSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }
  const { name, species, breed, dob, weight, sex, notes, chipNumber, motherChipNumber } = parsed.data;
  const avatarUrl = (raw.avatarUrl as string) || null;
  const pet = await prisma.pet.create({
    data: {
      name,
      species: species || "dog",
      breed: breed || null,
      dob: dob ? new Date(dob) : null,
      weight: weight ? Number(weight) : null,
      sex: sex || null,
      notes: notes || null,
      avatarUrl,
      chipNumber: chipNumber || null,
      motherChipNumber: motherChipNumber || null,
      members: {
        create: { userId, role: "OWNER", canView: true, canEdit: true },
      },
    },
  });
  revalidatePath("/pets");
  redirect(`/pets/${pet.id}`);
}

export async function updatePet(
  id: string,
  _prev: unknown,
  formData: FormData
): Promise<{ error?: Record<string, string[]> } | void> {
  const session = await getRequiredSession();
  await assertCanEdit(session.user.id, id);

  const raw = Object.fromEntries(formData);
  const parsed = petSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }
  const { name, species, breed, dob, weight, sex, notes, chipNumber, motherChipNumber } = parsed.data;
  const avatarUrl = (raw.avatarUrl as string) || null;
  await prisma.pet.update({
    where: { id },
    data: {
      name,
      species: species || "dog",
      breed: breed || null,
      dob: dob ? new Date(dob) : null,
      weight: weight ? Number(weight) : null,
      sex: sex || null,
      notes: notes || null,
      avatarUrl,
      chipNumber: chipNumber || null,
      motherChipNumber: motherChipNumber || null,
    },
  });
  revalidatePath(`/pets/${id}`);
  redirect(`/pets/${id}`);
}

async function _deletePetById(id: string) {
  await prisma.expense.deleteMany({ where: { petId: id } });
  await prisma.healthRecord.deleteMany({ where: { petId: id } });
  await prisma.feedRecord.deleteMany({ where: { petId: id } });
  await prisma.feedPlan.deleteMany({ where: { petId: id } });
  await prisma.careRecord.deleteMany({ where: { petId: id } });
  await prisma.feedReview.deleteMany({ where: { petId: id } });
  await prisma.pet.delete({ where: { id } });
}

export async function batchDeletePets(ids: string[]) {
  const session = await getRequiredSession();
  for (const id of ids) {
    await assertOwner(session.user.id, id);
    await _deletePetById(id);
  }
  revalidatePath("/pets");
}

export async function deletePet(id: string) {
  const session = await getRequiredSession();
  await assertOwner(session.user.id, id);
  await _deletePetById(id);
  revalidatePath("/pets");
  redirect("/pets");
}
