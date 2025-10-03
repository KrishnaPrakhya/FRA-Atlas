import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import { ErrorBoundary } from "@/components/error-boundary";
import { ReduxProvider } from "@/components/providers/redux-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { DashboardHeader } from "@/components/dashboard-header";

export const metadata: Metadata = {
  title: "Van-समर्थन - Forest Rights Act Management System",
  description:
    "Comprehensive digital platform for managing forest rights claims, document verification, and spatial data analysis",
  generator: "v0.app",
  icons: {
    icon: "/tree.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ReduxProvider>
          <DashboardHeader />
          <ErrorBoundary>
            <Suspense fallback={null}>{children}</Suspense>
            <Toaster position="top-right" />
          </ErrorBoundary>
        </ReduxProvider>
        <Analytics />
      </body>
    </html>
  );
}
