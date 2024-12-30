"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface PWAInstallPromptProps {
  platform: "ios" | "android";
  onDismiss: () => void;
  onInstall?: () => void;
}

const PWAInstallPrompt = ({
  platform,
  onDismiss,
  onInstall,
}: PWAInstallPromptProps) => {
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

        <AlertDescription className="mt-2 text-left">
          {platform === "ios" ? (
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
              onClick={onDismiss}
              className="border-popover-foreground text-sm text-popover-foreground text-white"
            >
              {platform === "ios" ? "Close" : "Cancel"}
            </Button>
            {platform === "android" && (
              <Button
                onClick={onInstall}
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
