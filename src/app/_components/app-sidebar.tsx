"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarLabel,
} from "@/components/ui/sidebar";
import { UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";

export function AppSidebar() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-gray-700">
        <SidebarLabel className="text-lg text-white">Rudy</SidebarLabel>
        <Image src="/logo.png" alt="logo" width={30} height={30} />
      </SidebarHeader>
      <SidebarContent></SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm transition-all">
          <UserButton />
          <div className="grid flex-1">
            <div className="font-medium text-white">{user.fullName}</div>
            <div className="overflow-hidden text-xs text-gray-400">
              <div className="line-clamp-1">
                {user.primaryEmailAddress?.emailAddress}
              </div>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
