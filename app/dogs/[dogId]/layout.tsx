import { notFound } from "next/navigation";
import Link from "next/link";
import { getDogById } from "@/lib/actions/dogs";
import { DogAvatar } from "@/components/dogs/DogAvatar";
import { differenceInYears, differenceInMonths } from "date-fns";
import { DOG_SEX, getLabel } from "@/lib/types";
import { getRequiredSession } from "@/lib/auth-utils";
import { buttonVariants } from "@/lib/button-variants";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";

const tabs = [
  { href: "", label: "總覽" },
  { href: "/care", label: "日常照護" },
  { href: "/feeding", label: "飼料" },
  { href: "/health", label: "健康照護" },
  { href: "/expenses", label: "花費" },
  { href: "/members", label: "成員", ownerOnly: true },
];

function formatAge(dob: Date | null) {
  if (!dob) return null;
  const years = differenceInYears(new Date(), dob);
  if (years > 0) return `${years} 歲`;
  const months = differenceInMonths(new Date(), dob);
  return `${months} 個月`;
}

export default async function DogLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ dogId: string }>;
}) {
  const { dogId } = await params;
  const session = await getRequiredSession();
  const [dog, member] = await Promise.all([
    getDogById(dogId),
    prisma.dogMember.findUnique({
      where: { dogId_userId: { dogId, userId: session.user.id } },
    }),
  ]);
  if (!dog || !member?.canView) notFound();

  return (
    <div>
      {/* Dog Header */}
      <div className="flex items-start gap-4 mb-6 pb-4 border-b">
        <DogAvatar name={dog.name} avatarUrl={dog.avatarUrl} size="lg" />
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold">{dog.name}</h1>
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mt-0.5">
            {dog.breed && <span>{dog.breed}</span>}
            {dog.sex && <span>{getLabel(DOG_SEX, dog.sex)}</span>}
            {dog.dob && <span>{formatAge(new Date(dog.dob))}</span>}
            {dog.weight && <span>{dog.weight} kg</span>}
            {dog.chipNumber && <span>晶片：{dog.chipNumber}</span>}
            {dog.motherChipNumber && <span>母犬晶片：{dog.motherChipNumber}</span>}
          </div>
        </div>
        {member.canEdit && (
          <Link
            href={`/dogs/${dogId}/edit`}
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "shrink-0")}
            aria-label="編輯"
          >
            <Pencil className="h-4 w-4" />
          </Link>
        )}
      </div>

      {/* Sub Navigation */}
      <nav className="flex gap-1 border-b mb-6 overflow-x-auto">
        {tabs
          .filter((tab) => !tab.ownerOnly || member.role === "OWNER")
          .map((tab) => (
            <Link
              key={tab.href}
              href={`/dogs/${dogId}${tab.href}`}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground whitespace-nowrap border-b-2 border-transparent hover:border-primary transition-colors data-[active]:border-primary data-[active]:text-foreground"
            >
              {tab.label}
            </Link>
          ))}
      </nav>

      {children}
    </div>
  );
}
