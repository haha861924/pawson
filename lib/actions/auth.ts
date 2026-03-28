"use server";

import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { registerSchema, loginSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";

export async function registerUser(_prev: unknown, formData: FormData) {
  const result = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }
  const { name, email, password } = result.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "此電子郵件已被使用" };

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({ data: { name, email, passwordHash } });

  try {
    await signIn("credentials", { email, password, redirectTo: "/dogs" });
  } catch (e) {
    if ((e as { digest?: string }).digest?.startsWith("NEXT_REDIRECT")) throw e;
    return { error: "註冊成功，請重新登入" };
  }
}

export async function loginUser(_prev: unknown, formData: FormData) {
  const result = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }
  const { email, password } = result.data;

  try {
    await signIn("credentials", { email, password, redirectTo: "/dogs" });
  } catch (e) {
    if ((e as { digest?: string }).digest?.startsWith("NEXT_REDIRECT")) throw e;
    return { error: "電子郵件或密碼錯誤" };
  }
}

export async function logoutUser() {
  await signOut({ redirectTo: "/auth/login" });
}
