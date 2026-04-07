import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { getDiscussionById, createComment, deleteDiscussion } from "@/lib/actions/discussions";
import { getRequiredSession } from "@/lib/auth-utils";
import { CommentForm } from "@/components/community/CommentForm";
import { CommentList } from "@/components/community/CommentList";
import { DeleteButton } from "@/components/shared/DeleteButton";
import { DISCUSSION_CATEGORIES, getLabel } from "@/lib/types";
import { buttonVariants } from "@/lib/button-variants";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DiscussionDetailPage({
  params,
}: {
  params: Promise<{ discussionId: string }>;
}) {
  const { discussionId } = await params;
  const [discussion, session] = await Promise.all([
    getDiscussionById(discussionId),
    getRequiredSession(),
  ]);
  if (!discussion) notFound();

  const isAuthor = discussion.authorId === session.user.id;

  async function commentAction(_prev: unknown, formData: FormData) {
    "use server";
    return createComment(discussionId, _prev, formData);
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/community"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; 返回討論列表
        </Link>
      </div>

      {/* Article */}
      <article className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {getLabel(DISCUSSION_CATEGORIES, discussion.category)}
              </span>
              <span className="text-xs text-muted-foreground">
                {discussion.author.name ?? "匿名"}
              </span>
              <span className="text-xs text-muted-foreground">
                {format(new Date(discussion.createdAt), "yyyy/MM/dd HH:mm")}
              </span>
            </div>
            <h1 className="text-xl font-bold">{discussion.title}</h1>
          </div>
          {isAuthor && (
            <div className="flex items-center gap-1 shrink-0">
              <Link
                href={`/community/${discussionId}/edit`}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                )}
                aria-label="編輯"
              >
                <Pencil className="h-4 w-4" />
              </Link>
              <DeleteButton
                label="刪除文章"
                onDelete={async () => {
                  "use server";
                  await deleteDiscussion(discussionId);
                }}
              />
            </div>
          )}
        </div>

        {discussion.imageUrl && (
          <div className="relative w-full max-h-96 overflow-hidden rounded-lg">
            <Image
              src={discussion.imageUrl}
              alt={discussion.title}
              width={800}
              height={400}
              className="object-cover w-full"
            />
          </div>
        )}

        <div className="prose prose-sm max-w-none">
          <p className="whitespace-pre-wrap">{discussion.content}</p>
        </div>
      </article>

      {/* Comments */}
      <div className="border-t pt-6 space-y-4">
        <h2 className="font-semibold">
          留言 ({discussion.comments.length})
        </h2>
        <CommentForm action={commentAction} />
        {discussion.comments.length > 0 && (
          <CommentList
            comments={discussion.comments}
            discussionId={discussionId}
            currentUserId={session.user.id}
          />
        )}
      </div>
    </div>
  );
}
