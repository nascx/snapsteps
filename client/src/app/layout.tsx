import type { Metadata } from "next";
import { Oswald } from "next/font/google";
import "./globals.css";

const oswald = Oswald({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IT@",
  description: "Ferramenta para instruções de trabalho",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <head>
        <link rel="shortcut icon" href="/s.png" type="image/png" />
      </head>
      <body className={oswald.className}>{children}</body>
    </html>
  );
}