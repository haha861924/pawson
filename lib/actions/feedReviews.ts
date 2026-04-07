"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { feedReviewSchema } from "@/lib/validations";
import { getRequiredSession, assertCanEdit } from "@/lib/auth-utils";

export async function getFeedReviews(petId: string) {
  return prisma.feedReview.findMany({
    where: { petId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createFeedReview(
  petId: string,
  _prev: unknown,
  formData: FormData
): Promise<{ error?: Record<string, string[]> } | void> {
  const session = await getRequiredSession();
  await assertCanEdit(session.user.id, petId);
  const raw = Object.fromEntries(formData);
  const parsed = feedReviewSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }
  const { foodName, brand, rating, review } = parsed.data;
  await prisma.feedReview.create({
    data: {
      petId,
      foodName,
      brand: brand || null,
      rating,
      review: review || null,
    },
  });
  revalidatePath(`/pets/${petId}/feeding`);
  revalidatePath(`/pets/${petId}/feeding/reviews`);
  redirect(`/pets/${petId}/feeding/reviews`);
}

export async function getFeedReviewById(id: string) {
  return prisma.feedReview.findUnique({ where: { id } });
}

export async function updateFeedReview(
  id: string,
  petId: string,
  _prev: unknown,
  formData: FormData
): Promise<{ error?: Record<string, string[]> } | void> {
  const session = await getRequiredSession();
  await assertCanEdit(session.user.id, petId);
  const raw = Object.fromEntries(formData);
  const parsed = feedReviewSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }
  const { foodName, brand, rating, review } = parsed.data;
  await prisma.feedReview.update({
    where: { id },
    data: {
      foodName,
      brand: brand || null,
      rating,
      review: review || null,
    },
  });
  revalidatePath(`/pets/${petId}/feeding`);
  revalidatePath(`/pets/${petId}/feeding/reviews`);
  redirect(`/pets/${petId}/feeding/reviews`);
}

export async function deleteFeedReview(id: string, petId: string) {
  const session = await getRequiredSession();
  await assertCanEdit(session.user.id, petId);
  await prisma.feedReview.delete({ where: { id } });
  revalidatePath(`/pets/${petId}/feeding`);
  revalidatePath(`/pets/${petId}/feeding/reviews`);
}
