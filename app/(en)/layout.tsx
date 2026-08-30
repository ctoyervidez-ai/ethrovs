import "../globals.css";
import en from "../content/en";
import { buildMetadata } from "../metadata";

export const metadata = buildMetadata("en", en);

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
