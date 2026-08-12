import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return {
    title: "ETHROVS — Digital Energy in Motion",
    description: "Bilingual websites, design and smart technology for businesses ready to move.",
    icons: {
      icon: "/assets/ethro-mark.png",
      shortcut: "/assets/ethro-mark.png",
    },
    openGraph: {
      title: "ETHROVS",
      description: "Digital energy in motion. Websites that move business.",
      type: "website",
      images: [{ url: `${origin}/og.png`, width: 1536, height: 1024, alt: "ETHROVS — Digital energy in motion" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "ETHROVS",
      description: "Digital energy in motion. Websites that move business.",
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
