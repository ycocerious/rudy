import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
} from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

export async function AppSidebar() {
  const user = await currentUser();

  if (!user) {
    return null;
  }

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
          <UserButton />
          <div className="grid flex-1">
            <div className="font-medium">{user.fullName}</div>
            <div className="overflow-hidden text-xs text-muted">
              <div className="line-clamp-1">
                {user.primaryEmailAddress?.emailAddress ?? "No Email Id added"}
              </div>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
