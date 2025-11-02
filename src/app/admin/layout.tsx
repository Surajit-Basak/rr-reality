
import Link from "next/link";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Building, LayoutDashboard, Home, MessageSquare, Newspaper, Settings, LogOut, User, Send, GalleryHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { AuthGuard } from "@/components/auth-guard";
import { LogoutButton } from "@/components/logout-button";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adminAvatar = PlaceHolderImages.find(p => p.id === 'agent-2');

  return (
    <AuthGuard role="admin">
      <SidebarProvider>
        <Sidebar collapsible="icon" className="border-r">
          <SidebarHeader>
            <Link href="/admin" className="flex items-center gap-2 font-bold text-lg text-sidebar-foreground">
              <Building className="size-6 text-sidebar-primary" />
              <span className="group-data-[collapsible=icon]:hidden">RR Realty Hub</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Dashboard">
                  <Link href="/admin">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Properties">
                  <Link href="/admin/properties">
                    <Home />
                    <span>Properties</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Submissions">
                  <Link href="/admin/submissions">
                    <Send />
                    <span>Submissions</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Inquiries">
                  <Link href="/admin/inquiries">
                    <MessageSquare />
                    <span>Inquiries</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Blog Posts">
                  <Link href="/admin/blog">
                    <Newspaper />
                    <span>Blog Posts</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Media">
                  <Link href="/admin/media">
                    <GalleryHorizontal />
                    <span>Media</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Settings">
                  <Link href="/admin/settings">
                    <Settings />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <LogoutButton />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="flex-1">
          <header className="flex h-16 items-center justify-between border-b bg-background px-6 shrink-0">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold">Admin Dashboard</h1>
            </div>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/admin/settings">
                <Avatar className="h-8 w-8">
                  {adminAvatar && <AvatarImage src={adminAvatar.imageUrl} />}
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <span className="sr-only">User Profile</span>
              </Link>
            </Button>
          </header>
          <main className="p-6 overflow-auto bg-muted/40 flex-1">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
