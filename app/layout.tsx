import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return {
    title: "Ethro Digital — Websites & AI, Built Fast",
    description: "Fast, professional websites, AI automation, SEO and digital solutions built for growing businesses.",
    icons: {
      icon: "/assets/ethro-mark.png",
      shortcut: "/assets/ethro-mark.png",
    },
    openGraph: {
      title: "Ethro Digital",
      description: "Websites & AI, built fast.",
      type: "website",
      images: [{ url: `${origin}/og.png`, width: 1731, height: 909, alt: "Ethro Digital" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Ethro Digital",
      description: "Websites & AI, built fast.",
      images: [`${origin}/og.png`],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
