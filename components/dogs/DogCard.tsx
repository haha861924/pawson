import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { DogAvatar } from "./DogAvatar";
import { differenceInYears, differenceInMonths } from "date-fns";
import { DOG_SEX, getLabel } from "@/lib/types";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import { Footprints, UtensilsCrossed, Heart, Wallet } from "lucide-react";

interface DogCardProps {
  dog: {
    id: string;
    name: string;
    breed: string | null;
    dob: Date | null;
    sex: string | null;
    avatarUrl: string | null;
    _count: { careRecords: number; healthRecords: number; expenses: number };
  };
  disableActions?: boolean;
}

function formatAge(dob: Date | null) {
  if (!dob) return null;
  const years = differenceInYears(new Date(), dob);
  if (years > 0) return `${years} 歲`;
  const months = differenceInMonths(new Date(), dob);
  return `${months} 個月`;
}

const quickActions = [
  { label: "散步", icon: Footprints, href: (id: string) => `/dogs/${id}/care/new` },
  { label: "餵食", icon: UtensilsCrossed, href: (id: string) => `/dogs/${id}/feeding/new` },
  { label: "健康", icon: Heart, href: (id: string) => `/dogs/${id}/health/new` },
  { label: "花費", icon: Wallet, href: (id: string) => `/dogs/${id}/expenses/new` },
];

export function DogCard({ dog, disableActions = false }: DogCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <Link href={disableActions ? "#" : `/dogs/${dog.id}`} className="block" tabIndex={disableActions ? -1 : undefined}>
          <div className="flex items-start gap-4">
            <DogAvatar name={dog.name} avatarUrl={dog.avatarUrl} size="lg" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg">{dog.name}</h3>
              <div className="text-sm text-muted-foreground space-y-0.5">
                {dog.breed && <p>{dog.breed}</p>}
                <div className="flex gap-2">
                  {dog.sex && <span>{getLabel(DOG_SEX, dog.sex)}</span>}
                  {dog.dob && (
                    <span>{formatAge(new Date(dog.dob))}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm border-t pt-3">
            <div>
              <p className="font-semibold">{dog._count.careRecords}</p>
              <p className="text-muted-foreground text-xs">照護</p>
            </div>
            <div>
              <p className="font-semibold">{dog._count.healthRecords}</p>
              <p className="text-muted-foreground text-xs">健康</p>
            </div>
            <div>
              <p className="font-semibold">{dog._count.expenses}</p>
              <p className="text-muted-foreground text-xs">花費</p>
            </div>
          </div>
        </Link>

        {/* Quick action buttons */}
        {!disableActions && (
          <div className="mt-3 pt-3 border-t grid grid-cols-4 gap-1.5">
            {quickActions.map(({ label, icon: Icon, href }) => (
              <Link
                key={label}
                href={href(dog.id)}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "flex flex-col gap-0.5 h-auto py-2 text-xs"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
