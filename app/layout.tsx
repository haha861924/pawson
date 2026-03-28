import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { auth } from "@/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pawson - 狗狗管理工具",
  description: "管理您的狗狗日常照護、飼料、健康及花費",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="zh-TW" className={`${geistSans.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-screen flex bg-background" suppressHydrationWarning>
        {session?.user && <Sidebar userName={session.user.name} />}
        <main className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto p-6">{children}</div>
        </main>
      </body>
    </html>
  );
}
