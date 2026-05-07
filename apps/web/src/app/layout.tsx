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
      <body className="flex flex-col h-dvh">
        <Providers>
          <TransitionProvider>
            <Header />
            <div className="relative flex flex-col flex-1 overflow-y-auto [container-type:size]">
              <CharacterThemeOverlay />
              {children}
            </div>
          </TransitionProvider>
        </Providers>
      </body>
    </html>
  );
}
