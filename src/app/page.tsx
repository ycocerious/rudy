"use client";

import "@/styles/globals.css";
import { UserButton } from "@clerk/nextjs";
import { TabsComponent } from "./_components/task-list/tabs-component";
import { TrackerCard } from "./_components/tracker/tracker-card";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-gray-950 p-4">
      <div className="mb-4 flex w-full min-w-[240px] justify-end rounded-sm border-gray-700 bg-gray-800 p-1 md:max-w-[1106px]">
        <UserButton />
      </div>
      <TrackerCard />
      <TabsComponent />
    </div>
  );
}
