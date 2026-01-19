import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/Toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "24fit - Build Full-Stack Apps in 24 Seconds with AI",
  description: "Generate complete mobile apps with UI, backend, auth, and database using AI. Powered by GPT-5.2, Claude 4.5, and Supabase.",
  keywords: ["AI app builder", "mobile app generator", "React Native", "Supabase", "no-code"],
  authors: [{ name: "24fit" }],
  openGraph: {
    title: "24fit - Build Full-Stack Apps in 24 Seconds",
    description: "Generate complete mobile apps with UI, backend, auth, and database using AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
