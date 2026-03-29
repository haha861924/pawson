import { notFound } from "next/navigation";
import { getMembersForDog, inviteMember, updateMemberPermissions, removeMember } from "@/lib/actions/members";
import { InviteMemberForm } from "@/components/dogs/InviteMemberForm";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DeleteButton } from "@/components/shared/DeleteButton";
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
        <CardContent className="divide-y">
          {members.map((m) => {
            const isThisMemberOwner = m.role === "OWNER";
            return (
              <div key={m.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm">
                      {m.user.name ?? m.user.email}
                    </span>
                    {m.user.name && (
                      <span className="text-xs text-muted-foreground">{m.user.email}</span>
                    )}
                    <Badge variant={isThisMemberOwner ? "default" : "secondary"}>
                      {isThisMemberOwner ? "飼主" : "共同扶養"}
                    </Badge>
                  </div>
                  {!isThisMemberOwner && (
                    <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                      <span>{m.canView ? "✓ 可查看" : "✗ 無法查看"}</span>
                      <span>{m.canEdit ? "✓ 可編輯" : "✗ 無法編輯"}</span>
                    </div>
                  )}
                </div>

                {!isThisMemberOwner && isOwner && (
                  <div className="flex items-center gap-2 shrink-0">
                    <form>
                      <button
                        formAction={async () => {
                          "use server";
                          await updateMemberPermissions(dogId, m.id, { canView: !m.canView });
                        }}
                        className="text-xs text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
                      >
                        {m.canView ? "取消查看" : "允許查看"}
                      </button>
                    </form>
                    <form>
                      <button
                        formAction={async () => {
                          "use server";
                          await updateMemberPermissions(dogId, m.id, { canEdit: !m.canEdit });
                        }}
                        className="text-xs text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
                      >
                        {m.canEdit ? "取消編輯" : "允許編輯"}
                      </button>
                    </form>
                    <DeleteButton
                      onDelete={async () => {
                        "use server";
                        await removeMember(dogId, m.id);
                      }}
                      label="移除成員"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
