import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AllTasksList } from "./all-tasks-list";
import { TodayTasksList } from "./today-tasks-list";

export function TabsComponent() {
  return (
    <Tabs
      defaultValue="today"
      className="flex w-full min-w-[240px] max-w-sm flex-grow flex-col"
    >
      <TabsList className="grid h-11 w-full grid-cols-2 rounded-lg bg-card text-muted">
        <TabsTrigger
          value="today"
          className="h-9 rounded-md data-[state=active]:bg-background"
        >
          Today
        </TabsTrigger>
        <TabsTrigger
          value="all"
          className="h-9 rounded-md data-[state=active]:bg-background"
        >
          All Habits
        </TabsTrigger>
      </TabsList>
      <div className="flex flex-grow justify-center">
        <TabsContent value="today" className="mt-0 w-full">
          <TodayTasksList />
        </TabsContent>
        <TabsContent value="all" className="mt-0 w-full">
          <AllTasksList />
        </TabsContent>
      </div>
    </Tabs>
  );
}
