"use client";

import { Badge } from "@/components/ui/badge";
import { DeleteButton } from "@/components/shared/DeleteButton";
import { updateMemberPermissions, removeMember } from "@/lib/actions/members";
import { toast } from "sonner";

interface Member {
  id: string;
  role: string;
  canView: boolean;
  canEdit: boolean;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
}

interface MemberListProps {
  members: Member[];
  dogId: string;
  isOwner: boolean;
}

export function MemberList({ members, dogId, isOwner }: MemberListProps) {
  const handleTogglePermission = async (
    memberId: string,
    permission: "canView" | "canEdit",
    currentValue: boolean
  ) => {
    try {
      const result = await updateMemberPermissions(dogId, memberId, {
        [permission]: !currentValue,
      });
      if (result.success) {
        toast.success("已更新權限");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "更新權限失敗");
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      const result = await removeMember(dogId, memberId);
      if (result.success) {
        toast.success("已移除成員");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "移除成員失敗");
    }
  };

  return (
    <div className="divide-y">
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
                <button
                  onClick={() => handleTogglePermission(m.id, "canView", m.canView)}
                  className="text-xs text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
                >
                  {m.canView ? "取消查看" : "允許查看"}
                </button>
                <button
                  onClick={() => handleTogglePermission(m.id, "canEdit", m.canEdit)}
                  className="text-xs text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
                >
                  {m.canEdit ? "取消編輯" : "允許編輯"}
                </button>
                <DeleteButton
                  onDelete={async () => {
                    await handleRemoveMember(m.id);
                  }}
                  label="移除成員"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
