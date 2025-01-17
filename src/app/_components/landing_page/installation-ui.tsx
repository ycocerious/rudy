"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import Image from "next/image";

interface InstallationUIProps {
  isDesktop: boolean;
  isIOS: boolean;
  handleButtonClick: () => void;
}

const InstallationUI = ({
  isDesktop,
  isIOS,
  handleButtonClick,
}: InstallationUIProps) => {
  if (isDesktop) {
    return (
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
              src="/qr_code_updated.png"
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
    );
  }

  return (
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
  );
};

export default InstallationUI;
