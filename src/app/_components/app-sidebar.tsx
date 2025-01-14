import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
} from "@/components/ui/sidebar";

import Image from "next/image";
import Link from "next/link";

export async function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-border">
        <SidebarLabel className="mr-1 text-lg text-foreground">
          Rudy
        </SidebarLabel>
        <Image src="/logo.png" alt="logo" width={30} height={30} />
      </SidebarHeader>
      <SidebarContent className="pt-0">
        <SidebarItem className="border border-t-0 py-3">
          <Link
            href="/feedback"
            className="text-primary transition-colors hover:text-accent"
          >
            Leave A Feedback!
          </Link>
        </SidebarItem>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm transition-all">
          <div className="grid flex-1">
            <div className="font-medium">{"No Name added"}</div>
            <div className="overflow-hidden text-xs text-muted">
              <div className="line-clamp-1">{"No Email Id added"}</div>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
