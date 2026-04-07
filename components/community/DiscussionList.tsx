import Link from "next/link";
import { format } from "date-fns";
import { MessageSquare } from "lucide-react";
import { DISCUSSION_CATEGORIES, getLabel } from "@/lib/types";

interface DiscussionItem {
  id: string;
  title: string;
  content: string;
  category: string;
  imageUrl: string | null;
  createdAt: Date;
  author: { id: string; name: string | null; image: string | null };
  _count: { comments: number };
}

export function DiscussionList({ discussions }: { discussions: DiscussionItem[] }) {
  return (
    <div className="space-y-3">
      {discussions.map((d) => (
        <Link
          key={d.id}
          href={`/community/${d.id}`}
          className="block p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {getLabel(DISCUSSION_CATEGORIES, d.category)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {d.author.name ?? "匿名"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(d.createdAt), "yyyy/MM/dd HH:mm")}
                </span>
              </div>
              <h3 className="font-semibold text-sm line-clamp-1">{d.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {d.content}
              </p>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground shrink-0">
              <MessageSquare className="h-4 w-4" />
              <span className="text-xs">{d._count.comments}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
