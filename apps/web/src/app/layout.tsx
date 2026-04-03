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
      <body className="flex h-screen flex-col overflow-hidden">
        <Providers>
          <Header />
          <div className="flex-1 overflow-y-auto">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
