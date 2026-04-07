import { notFound } from "next/navigation";
import { getDiscussionById, updateDiscussion } from "@/lib/actions/discussions";
import { getRequiredSession } from "@/lib/auth-utils";
import { DiscussionForm } from "@/components/community/DiscussionForm";
import { PageHeader } from "@/components/shared/PageHeader";

export default async function EditDiscussionPage({
  params,
}: {
  params: Promise<{ discussionId: string }>;
}) {
  const { discussionId } = await params;
  const [discussion, session] = await Promise.all([
    getDiscussionById(discussionId),
    getRequiredSession(),
  ]);
  if (!discussion || discussion.authorId !== session.user.id) notFound();

  async function editAction(_prev: unknown, formData: FormData) {
    "use server";
    return updateDiscussion(discussionId, _prev, formData);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="編輯文章" />
      <div className="max-w-lg">
        <DiscussionForm
          action={editAction}
          defaultValues={{
            title: discussion.title,
            content: discussion.content,
            category: discussion.category,
            imageUrls: discussion.imageUrls,
          }}
        />
      </div>
    </div>
  );
}
