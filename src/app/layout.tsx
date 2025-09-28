import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "VisualFlow - Social Media Graphics SaaS",
  description: "Create professional social media graphics with customizable templates",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-display bg-background-light dark:bg-background-dark`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
