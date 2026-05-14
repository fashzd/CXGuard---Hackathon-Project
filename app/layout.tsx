import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CXGuard",
  description: "A Lobster Trap-powered security gateway for AI customer support agents."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
