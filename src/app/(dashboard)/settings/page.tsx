import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { PageHeader } from "@/components/shared/page-header";
import { SettingsProfileForm } from "@/features/settings/components/settings-profile-form";
import { SettingsPasswordForm } from "@/features/settings/components/settings-password-form";
import { SettingsDangerZone } from "@/features/settings/components/settings-danger-zone";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata = {
  title: "Settings",
  description: "Manage your account settings.",
};

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <div className="space-y-8 pb-12 max-w-2xl">
      <PageHeader
        title="Settings"
        description="Manage your account preferences and security."
      />

      {/* Profile */}
      <Card className="glass border-white/20 shadow-lg">
        <CardHeader className="border-b bg-muted/30">
          <CardTitle className="text-lg font-semibold">Profile</CardTitle>
          <CardDescription>Update your display name.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <SettingsProfileForm
            initialName={session.user.name ?? ""}
            email={session.user.email ?? ""}
          />
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card className="glass border-white/20 shadow-lg">
        <CardHeader className="border-b bg-muted/30">
          <CardTitle className="text-lg font-semibold">Change Password</CardTitle>
          <CardDescription>Update your account password.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <SettingsPasswordForm />
        </CardContent>
      </Card>

      {/* Account Info */}
      <Card className="glass border-white/20 shadow-lg">
        <CardHeader className="border-b bg-muted/30">
          <CardTitle className="text-lg font-semibold">Account Info</CardTitle>
          <CardDescription>Your account details.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">User ID</p>
              <p className="font-mono text-xs text-muted-foreground">{session.user.id}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">Email</p>
              <p className="text-sm">{session.user.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />
      <SettingsDangerZone />
    </div>
  );
}
