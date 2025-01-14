"use client";

import { usePwaDisplayMode } from "@/hooks/usePwaDisplayMode";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { LoadingSpinner } from "./tracker/loading-spinner";

interface PwaWrapperProps {
  children: ReactNode;
}

export function PwaWrapper({ children }: PwaWrapperProps) {
  const displayMode = usePwaDisplayMode();
  const router = useRouter();

  useEffect(() => {
    if (displayMode === "standalone") {
      router.replace("/home");
    }
  }, [displayMode, router]);

  if (displayMode === null || displayMode === "standalone") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return <>{children}</>;
}
