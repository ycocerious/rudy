import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import "@/styles/globals.css";
import dynamic from "next/dynamic";
import { ContributionGrid } from "./_components/contribution-grid";
import { LoadingSpinner } from "./_components/loading-spinner";

const ScrollRightWrapper = dynamic(() => import("./_components/scroll-right"), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});

export default function Home() {
  return (
    <div className="flex min-h-screen items-start justify-center bg-gray-950 p-4">
      <Card className="flex w-full min-w-[240px] flex-col border-gray-700 bg-gray-800 md:max-w-[1106px]">
        <CardHeader>
          <CardTitle className="text-center text-lg text-gray-100 sm:text-xl md:text-2xl">
            Contribution Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollRightWrapper>
            <ContributionGrid />
          </ScrollRightWrapper>
        </CardContent>
      </Card>
    </div>
  );
}
