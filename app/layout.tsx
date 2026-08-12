import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return {
    title: "Ethernal DevOps — Modern Web Solutions",
    description: "Custom websites, SEO, software and design tailored to ambitious brands.",
    icons: {
      icon: "/assets/ethernal-mark.png",
      shortcut: "/assets/ethernal-mark.png",
    },
    openGraph: {
      title: "Ethernal DevOps",
      description: "Modern Web Solutions for Ambitious Brands",
      type: "website",
      images: [{ url: `${origin}/og.png`, width: 1536, height: 910, alt: "Ethernal DevOps" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Ethernal DevOps",
      description: "Modern Web Solutions for Ambitious Brands",
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
