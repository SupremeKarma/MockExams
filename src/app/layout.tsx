import type { Metadata } from "next";
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
};

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/components/NotificationProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-mesh text-slate-200`}
        suppressHydrationWarning
      >
        <div className="relative min-h-screen flex flex-col">
          <AuthProvider>
            <NotificationProvider>
              <Navbar />
              <main className="flex-1" style={{ paddingTop: '110px' }}>
                {children}
              </main>
              <Footer />
            </NotificationProvider>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
