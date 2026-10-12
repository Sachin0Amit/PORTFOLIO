import type { Metadata } from "next";
import { Geist, Geist_Mono, Orbitron, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Sachin Kumar // Cosmic Engineer Portfolio",
  description:
    "Portfolio of Sachin Kumar — B.Tech CSE student at Government Engineering College, Sheikhpura. Aspiring software engineer exploring the cosmos of code, languages, and alien technologies.",
  keywords: [
    "Sachin Kumar",
    "Portfolio",
    "Software Engineer",
    "B.Tech CSE",
    "Government Engineering College Sheikhpura",
    "Bihar",
    "Alien Theme",
    "Developer",
  ],
  authors: [{ name: "Sachin Kumar" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Sachin Kumar // Cosmic Engineer",
    description:
      "An alien-themed portfolio traversing the universe of code, learning, and ambition.",
    siteName: "Sachin Kumar Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sachin Kumar // Cosmic Engineer",
    description:
      "An alien-themed portfolio traversing the universe of code, learning, and ambition.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} ${spaceGrotesk.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
