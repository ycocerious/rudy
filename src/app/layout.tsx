import "@/styles/globals.css";

import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";
import { HydrateClient } from "@/trpc/server";
import { Toaster } from "react-hot-toast";
import { poppins } from "../styles/fonts";

import { ClerkProvider } from "@clerk/nextjs";
import { neobrutalism } from "@clerk/themes";

export const metadata: Metadata = {
  title: "Rudy",
  description:
    "A minimalist habit tracker designed to help you build a healthier lifestyle",
  manifest: "/manifest.json",
  icons: {
    icon: [
      {
        url: "/logo-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        url: "/logo-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: [neobrutalism],
      }}
    >
      <html lang="en" className={`${poppins.variable}`}>
        <body>
          <TRPCReactProvider>
            <HydrateClient>
              {children}
              <Toaster
                position="top-center"
                gutter={10}
                toastOptions={{
                  duration: 2000,
                }}
              />
            </HydrateClient>
          </TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
