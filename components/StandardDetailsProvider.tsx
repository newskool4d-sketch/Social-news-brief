"use client";

import { createContext, useContext } from "react";

export type StandardDetail = {
  text: string;
  explain?: string;
};

const StandardDetailsContext = createContext<Record<string, StandardDetail> | null>(null);

export function StandardDetailsProvider({
  details,
  children,
}: {
  details: Record<string, StandardDetail>;
  children: React.ReactNode;
}) {
  return (
    <StandardDetailsContext value={details}>{children}</StandardDetailsContext>
  );
}

export function useStandardDetail(code: string): StandardDetail | null {
  const details = useContext(StandardDetailsContext);
  if (!details) {
    throw new Error("useStandardDetail must be used within a StandardDetailsProvider");
  }
  return details[code] ?? null;
}
