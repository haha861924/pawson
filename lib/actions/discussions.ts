"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { discussionSchema, discussionCommentSchema } from "@/lib/validations";
import { getRequiredSession } from "@/lib/auth-utils";

export async function getDiscussions({
  category,
  search,
}: { category?: string; search?: string } = {}) {
  return prisma.discussion.findMany({
    where: {
      ...(category ? { category } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" as const } },
              { content: { contains: search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    },
    include: {
      author: { select: { id: true, name: true, image: true } },
      _count: { select: { comments: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getDiscussionById(id: string) {
  return prisma.discussion.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true, image: true } },
      comments: {
        include: {
          author: { select: { id: true, name: true, image: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

export async function createDiscussion(
  _prev: unknown,
  formData: FormData
): Promise<{ error?: Record<string, string[]> } | void> {
  const session = await getRequiredSession();
  const raw = Object.fromEntries(formData);
  const parsed = discussionSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }
  const { title, content, category, imageUrl } = parsed.data;
  const discussion = await prisma.discussion.create({
    data: {
      authorId: session.user.id,
      title,
      content,
      category,
      imageUrl: imageUrl || null,
    },
  });
  revalidatePath("/community");
  redirect(`/community/${discussion.id}`);
}

export async function updateDiscussion(
  id: string,
  _prev: unknown,
  formData: FormData
): Promise<{ error?: Record<string, string[]> } | void> {
  const session = await getRequiredSession();
  const discussion = await prisma.discussion.findUnique({ where: { id } });
  if (!discussion || discussion.authorId !== session.user.id) {
    throw new Error("Permission denied");
  }
  const raw = Object.fromEntries(formData);
  const parsed = discussionSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }
  const { title, content, category, imageUrl } = parsed.data;
  await prisma.discussion.update({
    where: { id },
    data: {
      title,
      content,
      category,
      imageUrl: imageUrl || null,
    },
  });
  revalidatePath("/community");
  revalidatePath(`/community/${id}`);
  redirect(`/community/${id}`);
}

export async function deleteDiscussion(id: string) {
  const session = await getRequiredSession();
  const discussion = await prisma.discussion.findUnique({ where: { id } });
  if (!discussion || discussion.authorId !== session.user.id) {
    throw new Error("Permission denied");
  }
  await prisma.discussion.delete({ where: { id } });
  revalidatePath("/community");
  redirect("/community");
}

export async function createComment(
  discussionId: string,
  _prev: unknown,
  formData: FormData
): Promise<{ error?: Record<string, string[]> } | void> {
  const session = await getRequiredSession();
  const raw = Object.fromEntries(formData);
  const parsed = discussionCommentSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }
  await prisma.discussionComment.create({
    data: {
      discussionId,
      authorId: session.user.id,
      content: parsed.data.content,
    },
  });
  revalidatePath(`/community/${discussionId}`);
}

export async function deleteComment(commentId: string, discussionId: string) {
  const session = await getRequiredSession();
  const comment = await prisma.discussionComment.findUnique({
    where: { id: commentId },
  });
  if (!comment || comment.authorId !== session.user.id) {
    throw new Error("Permission denied");
  }
  await prisma.discussionComment.delete({ where: { id: commentId } });
  revalidatePath(`/community/${discussionId}`);
}
