import { TabsComponent } from "./task-list/tabs-component";
import { ConsistencyTracker } from "./tracker/consistency-tracker";

export default function ServerPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-start p-4">
      <ConsistencyTracker />
      <TabsComponent />
    </div>
  );
}
