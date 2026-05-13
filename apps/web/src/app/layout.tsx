import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/layout/Header";
import { TransitionProvider } from "@/components/transitions/TransitionProvider";
import { CharacterThemeOverlay } from "@/components/transitions/CharacterThemeOverlay";

export const metadata: Metadata = {
  title: "Tavern Log",
  description: "TTRPG character archive",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-title" content="Tavern Log" />
      </head>
      <body className="flex h-dvh flex-col">
        <Providers>
          <TransitionProvider>
            <Header />
            <div className="relative flex-1 overflow-clip [container-type:size]">
              <div className="absolute inset-0 flex flex-col overflow-y-auto overflow-x-hidden">
                {children}
              </div>
              <CharacterThemeOverlay />
            </div>
          </TransitionProvider>
        </Providers>
      </body>
    </html>
  );
}
