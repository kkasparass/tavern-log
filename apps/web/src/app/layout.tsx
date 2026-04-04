import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "Tavern Log",
  description: "TTRPG character archive",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <Providers>
          <Header />
          <div className="flex-1">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
