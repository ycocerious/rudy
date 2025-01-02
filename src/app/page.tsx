"use client";

import { usePwaDisplayMode } from "@/hooks/usePwaDisplayMode";
import "@/styles/globals.css";
import LandingPage from "./_components/landing-page";
import ServerPage from "./_components/server-page";
import { LoadingSpinner } from "./_components/tracker/loading-spinner";

export default function Home() {
  const displayMode = usePwaDisplayMode();

  if (displayMode === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return displayMode === "standalone" ? <ServerPage /> : <LandingPage />;
}

// import "@/styles/globals.css";
// import ServerPage from "./_components/server-page";

// export default function Home() {
//   return <ServerPage />;
// }
