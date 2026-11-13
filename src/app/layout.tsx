import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Video Lab — Tu espacio creativo",
  description:
    "Estudio de creación y gestión audiovisual multimarca. Fase 1 con datos de demostración.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
