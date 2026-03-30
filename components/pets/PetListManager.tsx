"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { PetCard } from "./PetCard";
import { batchDeletePets } from "@/lib/actions/pets";
import { buttonVariants } from "@/lib/button-variants";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CheckSquare2, Trash2, X } from "lucide-react";

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  dob: Date | null;
  sex: string | null;
  avatarUrl: string | null;
  _count: { careRecords: number; healthRecords: number; expenses: number };
}

export function PetListManager({ pets }: { pets: Pet[] }) {
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function exitSelectMode() {
    setSelectMode(false);
    setSelected(new Set());
  }

  function handleDeleteSelected() {
    startTransition(async () => {
      await batchDeletePets([...selected]);
      exitSelectMode();
    });
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        {selectMode ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              已選 <span className="font-semibold text-foreground">{selected.size}</span> 隻
            </span>
            <button
              type="button"
              onClick={() => setSelected(new Set(pets.map((p) => p.id)))}
              className="text-xs text-primary hover:underline"
            >
              全選
            </button>
            <button
              type="button"
              onClick={() => setSelected(new Set())}
              className="text-xs text-muted-foreground hover:underline"
            >
              取消全選
            </button>
          </div>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-2">
          {selectMode ? (
            <button
              type="button"
              onClick={exitSelectMode}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}
            >
              <X className="h-3.5 w-3.5" />
              結束選取
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setSelectMode(true)}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}
            >
              <CheckSquare2 className="h-3.5 w-3.5" />
              選取
            </button>
          )}
          {!selectMode && (
            <Link href="/pets/new" className={cn(buttonVariants({ size: "sm" }))}>
              新增寵物
            </Link>
          )}
        </div>
      </div>

      {/* Pet grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pets.map((pet) => (
          <div key={pet.id} className="relative">
            {selectMode && (
              <button
                type="button"
                onClick={() => toggleSelect(pet.id)}
                className={cn(
                  "absolute top-2 left-2 z-10 h-6 w-6 rounded border-2 bg-background flex items-center justify-center transition-colors",
                  selected.has(pet.id)
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground/40"
                )}
                aria-label={selected.has(pet.id) ? `取消選取 ${pet.name}` : `選取 ${pet.name}`}
              >
                {selected.has(pet.id) && (
                  <svg viewBox="0 0 10 8" className="h-3 w-3 fill-current">
                    <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            )}
            <div
              className={cn(
                "transition-opacity",
                selectMode && selected.has(pet.id) && "ring-2 ring-primary rounded-xl"
              )}
              onClick={selectMode ? () => toggleSelect(pet.id) : undefined}
            >
              <PetCard pet={pet} disableActions={selectMode} />
            </div>
          </div>
        ))}
      </div>

      {/* Batch action bar */}
      {selectMode && selected.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-full border bg-card shadow-lg px-5 py-3">
          <span className="text-sm font-medium">已選 {selected.size} 隻</span>
          <AlertDialog>
            <AlertDialogTrigger
              className={cn(buttonVariants({ variant: "destructive", size: "sm" }), "gap-1.5")}
              disabled={isPending}
            >
              <Trash2 className="h-3.5 w-3.5" />
              {isPending ? "刪除中..." : `刪除 ${selected.size} 隻`}
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>確認刪除</AlertDialogTitle>
                <AlertDialogDescription>
                  確定要刪除選取的 {selected.size} 隻寵物？此操作將同時刪除所有相關的照護、健康、花費記錄，且無法復原。
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>取消</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteSelected}
                  className={cn(buttonVariants({ variant: "destructive" }))}
                >
                  確認刪除
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
}
