"use client";

import { useWindowSize } from "@/hooks/useWindowSize";
import { motion } from "framer-motion";
import { Apple, Dumbbell, Moon } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CursorGlow } from "../_components/landing_page/cursor-glow";
import { DotMatrix } from "../_components/landing_page/dot-matrix";
import { FeatureIcon } from "../_components/landing_page/feature-icon";
import PWAInstallPrompt from "../_components/pwa-install";
import { LoadingSpinner } from "../_components/tracker/loading-spinner";

// Dynamic import with no SSR
const InstallationUI = dynamic(
  () => import("@/app/_components/landing_page/installation-ui"),
  {
    ssr: false,
    loading: () => <LoadingSpinner />,
  },
);

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function Landing() {
  const { width } = useWindowSize();

  const isMobile = width < 640;
  const isTablet = width < 768;

  const logoSize = isMobile ? 130 : isTablet ? 170 : 200;

  const [isDesktop, setIsDesktop] = useState(false);

  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const isDesktopDevice =
      !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );
    setIsDesktop(width >= 640 && isDesktopDevice);
  }, [width]);

  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt as EventListener,
    );
    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowInstallPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleButtonClick = async () => {
    if (isIOS) {
      setShowInstallPrompt(true);
    } else {
      // Direct install for Android
      await handleInstall();
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <CursorGlow />

      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-card opacity-90" />
      <DotMatrix />

      {/* Main Content */}
      <div className="relative z-10 mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="mb-8 flex justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
          >
            <Image
              src="/logo.png"
              alt="Rudy Logo"
              width={logoSize}
              height={logoSize}
              priority
            />
          </motion.div>

          <h1 className="gradient-text mb-4 text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl">
            Welcome to Rudy
          </h1>

          <p className="mx-auto mb-8 max-w-3xl px-4 text-base text-muted-foreground sm:text-lg">
            A minimalist habit tracker - track only your sleep, exercise, and
            nutrition
          </p>

          <InstallationUI
            isDesktop={isDesktop}
            isIOS={isIOS}
            handleButtonClick={handleButtonClick}
          />

          {/* Core Features */}
          <div className="mt-12 flex justify-center sm:mt-14 md:mt-14">
            <FeatureIcon icon={Moon} label="Sleep Better" delay={0.2} />
            <FeatureIcon icon={Dumbbell} label="Move More" delay={0.4} />
            <FeatureIcon icon={Apple} label="Eat Well" delay={0.6} />
          </div>

          {showInstallPrompt && isIOS && (
            <PWAInstallPrompt onDismiss={() => setShowInstallPrompt(false)} />
          )}
        </motion.div>
      </div>
    </main>
  );
}
