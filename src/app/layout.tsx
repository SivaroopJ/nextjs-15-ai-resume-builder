import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import {ThemeProvider} from "next-themes"
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({subsets: ["latin"]})

export const metadata: Metadata = {
  title: {
    template: "%s - AI Resume Builder",
    absolute: "AI Resume Builder"
  },
  description: "A project to make an AI based resume builder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={inter.className}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            {/* Not too sure about toaster yet, importing from sonner for now */}
            <Toaster /> 
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
    
  );
}
