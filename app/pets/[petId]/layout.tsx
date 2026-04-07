import { notFound } from "next/navigation";
import Link from "next/link";
import { getPetById } from "@/lib/actions/pets";
import { PetAvatar } from "@/components/pets/PetAvatar";
import { differenceInYears, differenceInMonths } from "date-fns";
import { PET_SEX, PET_SPECIES, getLabel } from "@/lib/types";
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
  { href: "/weight", label: "成長曲線" },
  { href: "/diary", label: "日誌" },
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

export default async function PetLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ petId: string }>;
}) {
  const { petId } = await params;
  const session = await getRequiredSession();
  const [pet, member] = await Promise.all([
    getPetById(petId),
    prisma.petMember.findUnique({
      where: { petId_userId: { petId, userId: session.user.id } },
    }),
  ]);
  if (!pet || !member?.canView) notFound();

  return (
    <div>
      {/* Pet Header */}
      <div className="flex items-start gap-4 mb-6 pb-4 border-b">
        <PetAvatar name={pet.name} avatarUrl={pet.avatarUrl} size="lg" />
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold">{pet.name}</h1>
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mt-0.5">
            <span>{getLabel(PET_SPECIES, pet.species)}</span>
            {pet.breed && <span>{pet.breed}</span>}
            {pet.sex && <span>{getLabel(PET_SEX, pet.sex)}</span>}
            {pet.dob && <span>{formatAge(new Date(pet.dob))}</span>}
            {pet.weight && <span>{pet.weight} kg</span>}
            {pet.chipNumber && <span>晶片：{pet.chipNumber}</span>}
            {pet.motherChipNumber && <span>親代晶片：{pet.motherChipNumber}</span>}
          </div>
        </div>
        {member.canEdit && (
          <Link
            href={`/pets/${petId}/edit`}
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
              href={`/pets/${petId}${tab.href}`}
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
