import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AIR KIN / The Fan Breeding Studio",
  description: "Choose two fan personalities. Watch their inherited behaviors move. Breed a new individual through AI analysis.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
