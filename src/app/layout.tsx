import "@/styles/globals.css";

import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";
import { HydrateClient } from "@/trpc/server";
import { poppins } from "../styles/fonts";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Rudy",
  description: "The github-like way to build your habits.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
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
  );
}
