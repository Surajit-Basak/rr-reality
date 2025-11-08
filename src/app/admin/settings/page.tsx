
import { AuthGuard } from "@/components/auth-guard";
import { UserManagement } from "./user-management";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AppSettings } from "./app-settings";


export default function SettingsPage() {
  return (
    // Wrap the sensitive content with an AuthGuard checking for 'master-admin' role
    <AuthGuard role="master-admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your application settings and user roles.</p>
        </div>
        <Tabs defaultValue="users">
          <TabsList>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="app">App Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="users">
            <Card>
                <CardHeader>
                    <CardTitle>Users</CardTitle>
                    <CardDescription>
                        Manage user accounts and roles. Only Master Admins can create new users or change roles.
                    </CardDescription>
                </CardHeader>
                <UserManagement />
            </Card>
          </TabsContent>
          <TabsContent value="app">
            <Card>
                <CardHeader>
                    <CardTitle>App Settings</CardTitle>
                     <CardDescription>
                        Manage general application settings and data.
                    </CardDescription>
                </CardHeader>
                <AppSettings />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AuthGuard>
  );
}
