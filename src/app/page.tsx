import "@/styles/globals.css";
import { TrackerCard } from "./_components/tracker/tracker-card";
import { TabsComponent } from "./_components/task-list/tabs-component";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-gray-950 p-4">
      <TrackerCard />
      <TabsComponent />
    </div>
  );
}
