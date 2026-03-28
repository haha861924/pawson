import Link from "next/link";
import { buttonVariants } from "@/lib/button-variants";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: { label: string; href: string };
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && (
          <p className="text-muted-foreground text-sm mt-1">{description}</p>
        )}
      </div>
      {action && (
        <Link href={action.href} className={buttonVariants()}>
          {action.label}
        </Link>
      )}
    </div>
  );
}
