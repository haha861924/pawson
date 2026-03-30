import { notFound } from "next/navigation";
import { getMembersForDog, inviteMember } from "@/lib/actions/members";
import { InviteMemberForm } from "@/components/dogs/InviteMemberForm";
import { MemberList } from "@/components/dogs/MemberList";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRequiredSession } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function MembersPage({
  params,
}: {
  params: Promise<{ dogId: string }>;
}) {
  const { dogId } = await params;
  const session = await getRequiredSession();

  const callerMember = await prisma.dogMember.findUnique({
    where: { dogId_userId: { dogId, userId: session.user.id } },
  });
  if (!callerMember?.canView) notFound();

  const isOwner = callerMember.role === "OWNER";
  const members = await getMembersForDog(dogId);

  async function invite(_prev: unknown, formData: FormData) {
    "use server";
    return inviteMember(dogId, _prev, formData);
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader title="成員管理" />

      {isOwner && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">邀請共同扶養者</CardTitle>
          </CardHeader>
          <CardContent>
            <InviteMemberForm action={invite} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">成員列表</CardTitle>
        </CardHeader>
        <CardContent>
          <MemberList members={members} dogId={dogId} isOwner={isOwner} />
        </CardContent>
      </Card>
    </div>
  );
}
