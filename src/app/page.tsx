import { TabsComponent } from "./_components/task-list/tabs-component";
import { ConsistencyTracker } from "./_components/tracker/consistency-tracker";

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-start p-4">
      <ConsistencyTracker />
      <TabsComponent />
    </div>
  );
}
