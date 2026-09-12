import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MockExams | Premier Exam Preparation Platform",
  description: "Empowering students worldwide with guided exam preparation, real-time feedback, and high-quality mock tests. Join thousands of successful candidates.",
  keywords: ["MockExams", "Exam Prep", "IOE Mock Exam", "NEB Preparation", "Competitive Exams"],
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "MockExams", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  // Never block pinch-zoom: capping it locks out low-vision users.
  initialScale: 1,
  width: "device-width",
  maximumScale: 5,
  userScalable: true,
};

import { cookies } from "next/headers";
import { fontVariables } from "./fonts";
import {
  COOKIE_NAME,
  parseReadingCookie,
  readingAttributes,
} from "@/lib/examai/reading-settings";
import { AuthProvider } from "@/context/AuthContext";
import { ProgramProvider } from "@/context/ProgramContext";
import { NotificationProvider } from "@/components/NotificationProvider";
import AppShell from "@/components/AppShell";
import ServiceWorkerRegistrar from "@/components/ServiceWorkerRegistrar";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Reading preferences are resolved on the SERVER so the first paint is
  // already in the right theme. Reading them on the client would paint the
  // default first and repaint — a white flash in a dark room, which is exactly
  // the situation the Night theme exists for.
  const store = await cookies();
  const settings = parseReadingCookie(store.get(COOKIE_NAME)?.value);

  return (
    <html
      lang="en"
      suppressHydrationWarning
      {...readingAttributes(settings)}
      className={fontVariables}
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-zinc-900 overflow-x-hidden`}
        suppressHydrationWarning
      >
        <div className="relative min-h-screen flex flex-col">
          <AuthProvider>
            <ProgramProvider>
              <NotificationProvider>
                <AppShell>{children}</AppShell>
                <ServiceWorkerRegistrar />
              </NotificationProvider>
            </ProgramProvider>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
