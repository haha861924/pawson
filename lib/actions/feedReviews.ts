"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { feedReviewSchema } from "@/lib/validations";

export async function getFeedReviewsByDog(dogId: string) {
  return prisma.feedReview.findMany({
    where: { dogId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createFeedReview(
  dogId: string,
  _prev: unknown,
  formData: FormData
): Promise<{ error?: Record<string, string[]> } | void> {
  const raw = Object.fromEntries(formData);
  const parsed = feedReviewSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }
  const { foodName, brand, rating, review } = parsed.data;
  await prisma.feedReview.create({
    data: {
      dogId,
      foodName,
      brand: brand || null,
      rating,
      review: review || null,
    },
  });
  revalidatePath(`/dogs/${dogId}/feeding`);
}

export async function deleteFeedReview(id: string, dogId: string) {
  await prisma.feedReview.delete({ where: { id } });
  revalidatePath(`/dogs/${dogId}/feeding`);
}
