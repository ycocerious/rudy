"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if device is iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // If it's iOS, we want to show the manual instructions
    if (isIOSDevice) {
      setIsInstallable(true);
      return;
    }

    console.log("PWA Install Status:", {
      isInstallable: false,
      showPrompt: showPrompt,
      hasDeferredPrompt: false,
    });

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      console.log("PWA is installable - beforeinstallprompt event received");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    const handleAppInstalled = () => {
      setIsInstallable(false);
      setShowPrompt(false);
      console.log("PWA has been installed successfully");
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    // Cleanup
    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [showPrompt]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      console.log("Install clicked but no deferred prompt available");
      return;
    }

    console.log("Showing install prompt to user");
    await deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;
    console.log("User response to install prompt:", outcome);

    if (outcome === "accepted") {
      setIsInstallable(false);
      setShowPrompt(false);
    }

    // Clear the deferredPrompt for next time
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!isInstallable || !showPrompt) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Alert className="w-[95%] max-w-[500px] space-y-4 rounded-2xl border-none bg-gray-200 p-4 shadow-lg md:w-96">
        <div className="flex gap-2">
          <div className="flex items-center justify-center">
            <Download className="h-5 w-5 text-popover-foreground" />
          </div>
          <div className="flex items-center justify-center">
            <AlertTitle className="mb-0 text-lg font-semibold text-gray-950">
              Install App
            </AlertTitle>
          </div>
        </div>

        <AlertDescription className="mt-2">
          {isIOS ? (
            <div className="space-y-3 text-gray-950">
              <p>To install this app on iOS:</p>
              <ol className="list-decimal pl-5 text-sm">
                <li>Tap the Share button in Safari</li>
                <li>Scroll down and tap &quot;Add to Home Screen&quot;</li>
                <li>Tap &quot;Add&quot; to confirm</li>
              </ol>
            </div>
          ) : (
            <p className="mb-4 text-gray-950">
              Install our app for a better experience!
            </p>
          )}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={handleDismiss}
              className="border-popover-foreground text-sm text-popover-foreground text-white"
            >
              {isIOS ? "Close" : "I like pain"}
            </Button>
            {!isIOS && (
              <Button
                onClick={handleInstallClick}
                className="bg-[#09c3d2] text-sm text-accent-foreground hover:bg-primary"
              >
                Install Now!
              </Button>
            )}
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default PWAInstallPrompt;
