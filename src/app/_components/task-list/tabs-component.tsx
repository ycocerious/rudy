import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AllTasksList } from "./all-tasks-list";
import { TodayTasksList } from "./today-tasks-list";

export function TabsComponent() {
  return (
    <Tabs
      defaultValue="today"
      className="flex w-full min-w-[240px] max-w-lg flex-grow flex-col"
    >
      <TabsList className="mb-6 grid h-11 w-full grid-cols-2 rounded-lg bg-card text-muted">
        <TabsTrigger
          value="today"
          className="h-9 rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground"
        >
          Today&apos;s tasks
        </TabsTrigger>
        <TabsTrigger
          value="all"
          className="h-9 rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground"
        >
          All Tasks
        </TabsTrigger>
      </TabsList>
      <div className="flex flex-grow justify-center">
        <TabsContent value="today" className="mt-0">
          <TodayTasksList />
        </TabsContent>
        <TabsContent value="all" className="mt-0">
          <AllTasksList />
        </TabsContent>
      </div>
    </Tabs>
  );
}
