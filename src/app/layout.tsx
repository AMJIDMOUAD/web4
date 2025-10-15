import "./../styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Exoverse — Web4",
  description: "Neon city at night with WEB4 sphere, Exoverse TV, News Hub, Spot Jobs, Opportunities.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
