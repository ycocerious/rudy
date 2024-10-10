import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Grid } from "./grid";
import dynamic from "next/dynamic";
import { LoadingSpinner } from "./loading-spinner";

export const TrackerCard = () => {
  const ScrollRightWrapper = dynamic(() => import("./scroll-right-wrapper"), {
    ssr: false,
    loading: () => <LoadingSpinner />,
  });

  return (
    <Card className="mb-4 flex w-full min-w-[240px] flex-col border-gray-700 bg-gray-800 md:max-w-[1106px]">
      <CardHeader className="p-4">
        <CardTitle className="text-center text-lg text-gray-100 sm:text-xl md:text-2xl">
          Tracker Card
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollRightWrapper>
          <Grid />
        </ScrollRightWrapper>
      </CardContent>
    </Card>
  );
};
