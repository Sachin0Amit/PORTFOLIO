import type { Metadata, Viewport } from "next";
import { Unbounded, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const display = Unbounded({
  subsets: ["latin"],
  variable: "--font-unbounded",
});

const sans = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Sachin Kumar — Portfolio",
  description:
    "Sachin Kumar — B.Tech Computer Science & Engineering student at Government Engineering College, Sheikhpura. Aspiring software engineer, learning German and Japanese.",
  keywords: [
    "Sachin Kumar",
    "Portfolio",
    "Computer Science",
    "B.Tech CSE",
    "Government Engineering College Sheikhpura",
    "Software Engineer",
    "Web Development",
    "Developer",
  ],
  authors: [{ name: "Sachin Kumar" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Sachin Kumar — Portfolio",
    description:
      "Portfolio of Sachin Kumar — B.Tech CSE student at Government Engineering College, Sheikhpura.",
    siteName: "Sachin Kumar Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sachin Kumar — Portfolio",
    description:
      "Portfolio of Sachin Kumar — B.Tech CSE student at Government Engineering College, Sheikhpura.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0614",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${display.variable} ${sans.variable} ${mono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
