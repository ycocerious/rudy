import "@/styles/globals.css";
import ContributionTrackerCard from "./_components/contribution-tracker-card";

export default function Home() {
  return (
    <div className="flex min-h-screen items-start justify-center bg-gray-950 p-4">
      <ContributionTrackerCard />
    </div>
  );
}
