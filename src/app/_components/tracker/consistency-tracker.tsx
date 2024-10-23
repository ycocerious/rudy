"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dynamic from "next/dynamic";
import { Grid } from "./grid";
import { LoadingSpinner } from "./loading-spinner";
import { SidebarLayout, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "../app-sidebar";

const ScrollRightWrapper = dynamic(() => import("./scroll-right-wrapper"), {
  ssr: false,
  loading: LoadingSpinner,
});

export const ConsistencyTracker = () => {
  return (
    <Card className="mb-4 flex w-full min-w-[240px] flex-col border-border md:max-w-[1106px]">
      <CardHeader className="relative flex flex-row items-center py-4">
        <div className="absolute left-3">
          <SidebarLayout defaultOpen={false} className="z-50">
            <AppSidebar />
            <main className="flex flex-1 flex-col transition-all duration-300 ease-in-out">
              <SidebarTrigger />
            </main>
          </SidebarLayout>
        </div>
        <div className="flex flex-grow justify-center">
          <CardTitle className="text-center text-lg font-semibold text-foreground sm:text-xl md:text-2xl">
            Consistency Tracker
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollRightWrapper>
          <Grid />
        </ScrollRightWrapper>
      </CardContent>
    </Card>
  );
};
