import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
} from "@/components/ui/sidebar";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";

export async function AppSidebar() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Extract user details from Google provider data
  const userData = user?.user_metadata;

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
            Leave A Review!
          </Link>
        </SidebarItem>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm transition-all">
          {userData?.avatar_url && (
            <Image
              src={userData?.avatar_url as string}
              alt="Profile"
              width={32}
              height={32}
              className="rounded-full"
            />
          )}
          <div className="grid flex-1">
            <div className="font-medium">{userData?.full_name}</div>
            <div className="overflow-hidden text-xs text-muted">
              <div className="line-clamp-1">{userData?.email}</div>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
