"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type ResponseStyle = "explanatory" | "concise" | "technical" | "eli5";

interface ResponseStyleContextValue {
  style: ResponseStyle;
  setStyle: (style: ResponseStyle) => void;
}

const ResponseStyleContext = createContext<ResponseStyleContextValue | null>(
  null,
);

export function ResponseStyleProvider({ children }: { children: ReactNode }) {
  const [style, setStyle] = useState<ResponseStyle>("explanatory");

  return (
    <ResponseStyleContext.Provider value={{ style, setStyle }}>
      {children}
    </ResponseStyleContext.Provider>
  );
}

export function useResponseStyle() {
  const ctx = useContext(ResponseStyleContext);
  if (!ctx) {
    throw new Error("useResponseStyle must be used within ResponseStyleProvider");
  }
  return ctx;
}
