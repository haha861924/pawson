import { HEALTH_TYPES, getLabel } from "@/lib/types";
import { cn } from "@/lib/utils";

const colorMap: Record<string, string> = {
  vet_visit: "bg-red-100 text-red-800",
  vaccine: "bg-blue-100 text-blue-800",
  medication: "bg-orange-100 text-orange-800",
  deworming: "bg-green-100 text-green-800",
  dental: "bg-cyan-100 text-cyan-800",
  other: "bg-gray-100 text-gray-800",
};

export function HealthTypeBadge({ type }: { type: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        colorMap[type] ?? colorMap.other
      )}
    >
      {getLabel(HEALTH_TYPES, type)}
    </span>
  );
}
