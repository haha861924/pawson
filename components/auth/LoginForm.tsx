"use client";

import { useActionState } from "react";
import { loginUser } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { GoogleSignInButton } from "./GoogleSignInButton";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginUser, null);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">登入</h1>
        <p className="text-sm text-muted-foreground mt-1">
          還沒有帳號？{" "}
          <Link href="/auth/register" className="underline">
            註冊
          </Link>
        </p>
      </div>

      <form action={action} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="email">電子郵件</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="password">密碼</Label>
          <Input id="password" name="password" type="password" required />
        </div>

        {state?.error && (
          <p className="text-sm text-destructive">{state.error}</p>
        )}

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "登入中…" : "登入"}
        </Button>
      </form>

      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">或</span>
        </div>
      </div>

      <GoogleSignInButton />
    </div>
  );
}
