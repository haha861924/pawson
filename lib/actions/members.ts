"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getRequiredSession, assertOwner } from "@/lib/auth-utils";

export async function getMembersForDog(petId: string) {
  const session = await getRequiredSession();
  // Verify caller can view the pet
  const caller = await prisma.petMember.findUnique({
    where: { petId_userId: { petId, userId: session.user.id } },
  });
  if (!caller?.canView) throw new Error("Permission denied");

  return prisma.petMember.findMany({
    where: { petId },
    include: { user: { select: { id: true, name: true, email: true, image: true } } },
    orderBy: { createdAt: "asc" },
  });
}

export async function inviteMember(
  petId: string,
  _prev: unknown,
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  const session = await getRequiredSession();
  await assertOwner(session.user.id, petId);

  const email = (formData.get("email") as string)?.trim().toLowerCase();
  if (!email) return { error: "請輸入電子郵件" };

  const invitee = await prisma.user.findUnique({ where: { email } });
  if (!invitee) return { error: "找不到此電子郵件的使用者" };
  if (invitee.id === session.user.id) return { error: "無法邀請自己" };

  const existing = await prisma.petMember.findUnique({
    where: { petId_userId: { petId, userId: invitee.id } },
  });
  if (existing) return { error: "此使用者已是成員" };

  await prisma.petMember.create({
    data: { petId, userId: invitee.id, role: "CARETAKER", canView: true, canEdit: false },
  });
  revalidatePath(`/pets/${petId}/members`);
  return { success: `已邀請 ${invitee.name ?? invitee.email}` };
}

export async function updateMemberPermissions(
  petId: string,
  memberId: string,
  data: { canView?: boolean; canEdit?: boolean }
): Promise<{ success: boolean }> {
  const session = await getRequiredSession();
  await assertOwner(session.user.id, petId);

  const member = await prisma.petMember.findUnique({ where: { id: memberId } });
  if (!member || member.petId !== petId) throw new Error("成員不存在");
  if (member.role === "OWNER") throw new Error("無法修改飼主權限");

  await prisma.petMember.update({ where: { id: memberId }, data });
  revalidatePath(`/pets/${petId}/members`);
  return { success: true };
}

export async function removeMember(petId: string, memberId: string) {
  const session = await getRequiredSession();
  await assertOwner(session.user.id, petId);

  const member = await prisma.petMember.findUnique({ where: { id: memberId } });
  if (!member || member.petId !== petId) throw new Error("成員不存在");
  if (member.role === "OWNER") throw new Error("無法移除飼主");

  await prisma.petMember.delete({ where: { id: memberId } });
  revalidatePath(`/pets/${petId}/members`);
}
