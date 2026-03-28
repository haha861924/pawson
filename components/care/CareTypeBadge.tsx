import { Badge } from "@/components/ui/badge";
import { CARE_TYPES, getLabel } from "@/lib/types";
import { cn } from "@/lib/utils";

const colorMap: Record<string, string> = {
  walk: "bg-green-100 text-green-800",
  bath: "bg-blue-100 text-blue-800",
  grooming: "bg-purple-100 text-purple-800",
  play: "bg-yellow-100 text-yellow-800",
  training: "bg-orange-100 text-orange-800",
  other: "bg-gray-100 text-gray-800",
};

export function CareTypeBadge({ type }: { type: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        colorMap[type] ?? colorMap.other
      )}
    >
      {getLabel(CARE_TYPES, type)}
    </span>
  );
}
