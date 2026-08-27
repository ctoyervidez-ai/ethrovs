import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    metadataBase: new URL("https://ethrovs.com"),
    title: "ETHROVS — Digital Energy in Motion",
    description: "Bilingual websites, design and smart technology for businesses ready to move.",
    icons: {
      icon: "/assets/ethro-mark.png",
      shortcut: "/assets/ethro-mark.png",
      apple: [{ url: "/apple-touch-icon.png", sizes: "1024x1024", type: "image/png" }],
    },
    openGraph: {
      title: "ETHROVS",
      description: "Digital energy in motion. Websites that move business.",
      type: "website",
      images: [{ url: "/og.png", width: 1536, height: 1024, alt: "ETHROVS — Digital energy in motion" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "ETHROVS",
      description: "Digital energy in motion. Websites that move business.",
      images: ["/og.png"],
    },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
