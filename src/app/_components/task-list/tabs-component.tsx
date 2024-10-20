import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AllTasksList } from "./all-tasks-list";
import { TodayTasksList } from "./today-tasks-list";

export function TabsComponent() {
  return (
    <Tabs defaultValue="today" className="mb-2 w-full min-w-[240px] max-w-lg">
      <TabsList className="grid h-11 w-full grid-cols-2 rounded-lg bg-gray-800 text-[#A1A1AA]">
        <TabsTrigger
          value="today"
          className="h-9 rounded-md data-[state=active]:bg-gray-950 data-[state=active]:text-white"
        >
          Today&apos;s tasks
        </TabsTrigger>
        <TabsTrigger
          value="all"
          className="h-9 rounded-md data-[state=active]:bg-gray-950 data-[state=active]:text-white"
        >
          All Tasks
        </TabsTrigger>
      </TabsList>
      <TabsContent value="today">
        <TodayTasksList />
      </TabsContent>
      <TabsContent value="all">
        <AllTasksList />
      </TabsContent>
    </Tabs>
  );
}
