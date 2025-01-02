// "use client";

// import "@/styles/globals.css";
// import { useEffect, useState } from "react";
// import LandingPage from "./_components/landing-page";
// import ServerPage from "./_components/server-page";

// type DisplayMode = "browser" | "standalone" | "fullscreen" | "minimal-ui";

// export default function Home() {
//   const [displayMode, setDisplayMode] = useState<DisplayMode>("browser");

//   useEffect(() => {
//     // Check if running as installed PWA
//     const isStandalone =
//       window.matchMedia("(display-mode: standalone)").matches ??
//       ("standalone" in window.navigator &&
//         (window.navigator as Navigator & { standalone?: boolean })
//           .standalone) ??
//       document.referrer.includes("android-app://"); // For TWA

//     setDisplayMode(isStandalone ? "standalone" : "browser");

//     // Optional: Listen for display mode changes
//     const mediaQuery = window.matchMedia("(display-mode: standalone)");
//     const handleDisplayModeChange = (e: MediaQueryListEvent) => {
//       setDisplayMode(e.matches ? "standalone" : "browser");
//     };

//     mediaQuery.addEventListener("change", handleDisplayModeChange);

//     return () => {
//       mediaQuery.removeEventListener("change", handleDisplayModeChange);
//     };
//   }, []);

//   if (displayMode === "standalone") {
//     console.log("ServerPage");
//     return <ServerPage />;
//   } else {
//     return <LandingPage />;
//   }
// }

import "@/styles/globals.css";
import ServerPage from "./_components/server-page";

export default function Home() {
  return <ServerPage />;
}
