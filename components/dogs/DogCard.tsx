import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { DogAvatar } from "./DogAvatar";
import { differenceInYears, differenceInMonths } from "date-fns";
import { DOG_SEX, getLabel } from "@/lib/types";

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
}

function formatAge(dob: Date | null) {
  if (!dob) return null;
  const years = differenceInYears(new Date(), dob);
  if (years > 0) return `${years} 歲`;
  const months = differenceInMonths(new Date(), dob);
  return `${months} 個月`;
}

export function DogCard({ dog }: DogCardProps) {
  return (
    <Link href={`/dogs/${dog.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="pt-6">
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
        </CardContent>
      </Card>
    </Link>
  );
}
