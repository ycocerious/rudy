import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarLayout, SidebarTrigger } from "@/components/ui/sidebar";
import dynamic from "next/dynamic";
import { AppSidebar } from "../app-sidebar";
import { Grid } from "./grid";
import { LoadingSpinner } from "./loading-spinner";

const ScrollRightWrapper = dynamic(() => import("./scroll-right-wrapper"), {
  ssr: false,
  loading: LoadingSpinner,
});

export const ConsistencyTracker = () => {
  return (
    <Card className="mb-4 flex w-full min-w-[240px] max-w-sm flex-col border-border">
      <CardHeader className="relative flex flex-row items-center py-4">
        <div className="absolute left-3">
          <SidebarLayout defaultOpen={false} className="z-50">
            <AppSidebar />
            <main className="ml-2 flex flex-1 flex-col transition-all duration-300 ease-in-out">
              <SidebarTrigger />
            </main>
          </SidebarLayout>
        </div>
        <div className="flex flex-grow justify-center">
          <CardTitle className="text-center text-lg font-semibold">
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
