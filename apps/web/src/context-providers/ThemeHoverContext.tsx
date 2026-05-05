"use client";
import { createContext, useContext, useState } from "react";

interface ThemeHoverCtx {
  bgColor: string | null;
  setHoverColor: (color: string | null) => void;
}

const fallback: ThemeHoverCtx = { bgColor: null, setHoverColor: () => {} };
const Ctx = createContext<ThemeHoverCtx>(fallback);
export const useThemeHover = () => useContext(Ctx);

export function ThemeHoverProvider({ children }: { children: React.ReactNode }) {
  const [bgColor, setBgColor] = useState<string | null>(null);
  return <Ctx.Provider value={{ bgColor, setHoverColor: setBgColor }}>{children}</Ctx.Provider>;
}
