import "../globals.css";
import es from "../content/es";
import { buildMetadata } from "../metadata";

export const metadata = buildMetadata("es", es);

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
