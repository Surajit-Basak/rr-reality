'use client';

import { useAuth } from "@/firebase";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { SidebarMenuButton } from "./ui/sidebar";


export function LogoutButton() {
    const auth = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await auth.signOut();
        router.push('/login');
    };

    return (
        <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
            <LogOut />
            <span>Logout</span>
        </SidebarMenuButton>
    );
}
