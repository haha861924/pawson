import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Sidebar, MobileNav } from "@/components/layout/Sidebar";
import { auth } from "@/auth";
import { Toaster } from "sonner";
import { GoogleAnalytics } from "@/components/shared/GoogleAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pawson - 寵物管理工具",
  description: "管理您的寵物日常照護、飼料、健康及花費",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="zh-TW" className={`${geistSans.variable} h-full antialiased`} suppressHydrationWarning>
      <GoogleAnalytics />
      <body className="min-h-screen flex bg-background" suppressHydrationWarning>
        {session?.user && <Sidebar userName={session.user.name} />}
        <main className="flex-1 overflow-auto pb-20 md:pb-0">
          <div className="max-w-4xl mx-auto p-4 md:p-6">{children}</div>
        </main>
        {session?.user && <MobileNav userName={session.user.name} />}
        <Toaster />
      </body>
    </html>
  );
}
