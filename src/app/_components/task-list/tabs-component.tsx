import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TodayTasksList } from "./today-tasks-list";
import { AllTasksList } from "./all-tasks-list";

export function TabsComponent() {
  return (
    <Tabs defaultValue="today" className="mb-2 w-full min-w-[240px] max-w-lg">
      <TabsList className="grid h-12 w-full grid-cols-2 bg-gray-800 text-[#A1A1AA]">
        <TabsTrigger
          value="today"
          className="h-10 data-[state=active]:bg-gray-950 data-[state=active]:text-white"
        >
          Today&apos;s tasks
        </TabsTrigger>
        <TabsTrigger
          value="all"
          className="h-10 data-[state=active]:bg-gray-950 data-[state=active]:text-white"
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
