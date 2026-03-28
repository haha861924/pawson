import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function getRequiredSession() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");
  return session;
}

export async function assertCanEdit(userId: string, dogId: string) {
  const member = await prisma.dogMember.findUnique({
    where: { dogId_userId: { dogId, userId } },
  });
  if (!member?.canEdit) throw new Error("Permission denied");
}

export async function assertOwner(userId: string, dogId: string) {
  const member = await prisma.dogMember.findUnique({
    where: { dogId_userId: { dogId, userId } },
  });
  if (member?.role !== "OWNER") throw new Error("Owner only");
}
