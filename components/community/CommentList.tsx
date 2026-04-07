"use client";

import { format } from "date-fns";
import { DeleteButton } from "@/components/shared/DeleteButton";
import { deleteComment } from "@/lib/actions/discussions";

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  author: { id: string; name: string | null; image: string | null };
}

export function CommentList({
  comments,
  discussionId,
  currentUserId,
}: {
  comments: Comment[];
  discussionId: string;
  currentUserId: string;
}) {
  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <div key={comment.id} className="p-3 rounded-lg bg-muted/50">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium">
                  {comment.author.name ?? "匿名"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(comment.createdAt), "yyyy/MM/dd HH:mm")}
                </span>
              </div>
              <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
            </div>
            {comment.author.id === currentUserId && (
              <DeleteButton
                onDelete={async () => {
                  await deleteComment(comment.id, discussionId);
                }}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
