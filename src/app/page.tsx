"use client";

import { usePwaDisplayMode } from "@/hooks/usePwaDisplayMode";
import "@/styles/globals.css";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LandingPage from "./_components/landing-page";
import { LoadingSpinner } from "./_components/tracker/loading-spinner";

export default function Home() {
  const displayMode = usePwaDisplayMode();
  const router = useRouter();

  useEffect(() => {
    if (displayMode === "standalone") {
      router.replace("/home");
    }
  }, [displayMode, router]);

  if (displayMode === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return <LandingPage />;
}

// import "@/styles/globals.css";
// import ServerPage from "./_components/server-page";

// export default function Home() {
//   return <ServerPage />;
// }
