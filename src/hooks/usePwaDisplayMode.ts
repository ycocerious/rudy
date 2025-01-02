import { type DisplayMode } from "@/types/pwa";
import { useLayoutEffect, useState } from "react";

export const usePwaDisplayMode = () => {
  const [displayMode, setDisplayMode] = useState<DisplayMode | null>(null);

  useLayoutEffect(() => {
    const checkDisplayMode = () => {
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ??
        ("standalone" in window.navigator &&
          (window.navigator as Navigator & { standalone?: boolean })
            .standalone) ??
        document.referrer.includes("android-app://");

      setDisplayMode(isStandalone ? "standalone" : "browser");
    };

    checkDisplayMode();

    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      setDisplayMode(e.matches ? "standalone" : "browser");
    };

    mediaQuery.addEventListener("change", handleDisplayModeChange);
    return () =>
      mediaQuery.removeEventListener("change", handleDisplayModeChange);
  }, []);

  return displayMode;
};
