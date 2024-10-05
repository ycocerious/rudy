import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ContributionGrid } from "./contribution-grid";
import dynamic from "next/dynamic";
import { LoadingSpinner } from "./loading-spinner";

export const ContributionTrackerCard = () => {
  const ScrollRightWrapper = dynamic(() => import("./scroll-right"), {
    ssr: false,
    loading: () => <LoadingSpinner />,
  });

  return (
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
  );
};

export default ContributionTrackerCard;
