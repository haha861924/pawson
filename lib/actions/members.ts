"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getRequiredSession, assertOwner } from "@/lib/auth-utils";

export async function getMembersForDog(dogId: string) {
  const session = await getRequiredSession();
  // Verify caller can view the dog
  const caller = await prisma.dogMember.findUnique({
    where: { dogId_userId: { dogId, userId: session.user.id } },
  });
  if (!caller?.canView) throw new Error("Permission denied");

  return prisma.dogMember.findMany({
    where: { dogId },
    include: { user: { select: { id: true, name: true, email: true, image: true } } },
    orderBy: { createdAt: "asc" },
  });
}

export async function inviteMember(
  dogId: string,
  _prev: unknown,
  formData: FormData
): Promise<{ error?: string; success?: string }> {
  const session = await getRequiredSession();
  await assertOwner(session.user.id, dogId);

  const email = (formData.get("email") as string)?.trim().toLowerCase();
  if (!email) return { error: "請輸入電子郵件" };

  const invitee = await prisma.user.findUnique({ where: { email } });
  if (!invitee) return { error: "找不到此電子郵件的使用者" };
  if (invitee.id === session.user.id) return { error: "無法邀請自己" };

  const existing = await prisma.dogMember.findUnique({
    where: { dogId_userId: { dogId, userId: invitee.id } },
  });
  if (existing) return { error: "此使用者已是成員" };

  await prisma.dogMember.create({
    data: { dogId, userId: invitee.id, role: "CARETAKER", canView: true, canEdit: false },
  });
  revalidatePath(`/dogs/${dogId}/members`);
  return { success: `已邀請 ${invitee.name ?? invitee.email}` };
}

export async function updateMemberPermissions(
  dogId: string,
  memberId: string,
  data: { canView?: boolean; canEdit?: boolean }
) {
  const session = await getRequiredSession();
  await assertOwner(session.user.id, dogId);

  const member = await prisma.dogMember.findUnique({ where: { id: memberId } });
  if (!member || member.dogId !== dogId) throw new Error("成員不存在");
  if (member.role === "OWNER") throw new Error("無法修改飼主權限");

  await prisma.dogMember.update({ where: { id: memberId }, data });
  revalidatePath(`/dogs/${dogId}/members`);
}

export async function removeMember(dogId: string, memberId: string) {
  const session = await getRequiredSession();
  await assertOwner(session.user.id, dogId);

  const member = await prisma.dogMember.findUnique({ where: { id: memberId } });
  if (!member || member.dogId !== dogId) throw new Error("成員不存在");
  if (member.role === "OWNER") throw new Error("無法移除飼主");

  await prisma.dogMember.delete({ where: { id: memberId } });
  revalidatePath(`/dogs/${dogId}/members`);
}
