"use client";

import { Button } from "@/components/ui/button";
import { useWindowSize } from "@/hooks/useWindowSize";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Apple, Download, Dumbbell, Moon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CursorGlow } from "./landing_page/cursor-glow";
import { DotMatrix } from "./landing_page/dot-matrix";
import { FeatureIcon } from "./landing_page/feature-icon";
import PWAInstallPrompt from "./pwa-install";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function Home() {
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
    console.log("Handling install");
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log("Outcome:", outcome);
    if (outcome === "accepted") {
      setShowInstallPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleButtonClick = async () => {
    console.log("Handling button click");
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

          {isDesktop ? (
            <div className="flex flex-col items-center gap-4">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
                className="group relative"
              >
                <div
                  className={cn(
                    "absolute inset-0 rounded-xl bg-primary/20 blur-xl",
                    "transition-all group-hover:bg-primary/30",
                  )}
                />
                <div
                  className={cn(
                    "relative aspect-square w-56 rounded-xl border border-border bg-card",
                    "transition-colors group-hover:border-primary",
                  )}
                >
                  <Image
                    src="/qr_code.png"
                    alt="QR Code to install Rudy"
                    fill
                    className="rounded-xl"
                    priority
                  />
                </div>
              </motion.div>
              <p className="mt-3 text-2xl text-primary">
                Scan with your phone to install!
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: [-8, 0] }}
              transition={{
                repeat: Infinity,
                repeatType: "reverse",
                duration: 0.6,
                ease: "easeInOut",
              }}
            >
              <Button
                onClick={handleButtonClick}
                className="h-12 w-[70%] bg-[#09c3d2] text-accent-foreground hover:bg-primary"
              >
                <Download className="mr-2 h-6 w-6" />
                <p className="text-md font-semibold">
                  {isIOS ? "Install on iOS" : "Install on Android"}
                </p>
              </Button>
            </motion.div>
          )}

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
