import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Klepak",
  description: "Klepak digital signage",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="font-sans">
      <body>{children}</body>
    </html>
  );
}
