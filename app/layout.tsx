import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Oracolo del Giorno",
  description: "Un oracolo mistico per la tua guida quotidiana",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
