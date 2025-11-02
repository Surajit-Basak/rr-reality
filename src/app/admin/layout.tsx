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
import { Building, LayoutDashboard, Home, MessageSquare, Newspaper, Settings, LogOut, User } from "lucide-react";
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
    <AuthGuard>
        <SidebarProvider>
        <div className="flex min-h-screen">
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
                    <SidebarMenuButton href="/admin" isActive tooltip="Dashboard">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton href="/admin" tooltip="Properties">
                    <Home />
                    <span>Properties</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton href="/admin" tooltip="Inquiries">
                    <MessageSquare />
                    <span>Inquiries</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton href="/admin" tooltip="Blog Posts">
                    <Newspaper />
                    <span>Blog Posts</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton href="/admin" tooltip="Settings">
                    <Settings />
                    <span>Settings</span>
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
            <SidebarInset className="bg-muted/40">
                <header className="flex h-16 items-center justify-between border-b bg-background px-6">
                    <div className="flex items-center gap-4">
                        <SidebarTrigger />
                        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
                    </div>
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="#">
                            <Avatar className="h-8 w-8">
                                {adminAvatar && <AvatarImage src={adminAvatar.imageUrl} />}
                                <AvatarFallback>A</AvatarFallback>
                            </Avatar>
                            <span className="sr-only">User Profile</span>
                        </Link>
                    </Button>
                </header>
                <div className="p-4 md:p-8">
                    {children}
                </div>
            </SidebarInset>
        </div>
        </SidebarProvider>
    </AuthGuard>
  );
}
