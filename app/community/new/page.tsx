import { createDiscussion } from "@/lib/actions/discussions";
import { DiscussionForm } from "@/components/community/DiscussionForm";
import { PageHeader } from "@/components/shared/PageHeader";

export default function NewDiscussionPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="發佈新文章" />
      <div className="max-w-lg">
        <DiscussionForm action={createDiscussion} />
      </div>
    </div>
  );
}
