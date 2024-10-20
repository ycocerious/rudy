"use client";

import "@/styles/globals.css";
import { TabsComponent } from "./_components/task-list/tabs-component";
import { ConsistencyTracker } from "./_components/tracker/consistency-tracker";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-gray-950 p-4">
      <ConsistencyTracker />
      <TabsComponent />
    </div>
  );
}
