import Link from "next/link";
import { buttonVariants } from "@/lib/button-variants";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: { label: string; href: string };
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <p className="text-lg font-medium text-muted-foreground">{title}</p>
      {description && (
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      )}
      {action && (
        <Link href={action.href} className={`${buttonVariants()} mt-4 inline-flex`}>
          {action.label}
        </Link>
      )}
    </div>
  );
}
