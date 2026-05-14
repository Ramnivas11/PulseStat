import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getWebsitesByUserId } from "@/features/websites/services/website.service";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { WebsiteCard } from "@/features/websites/components/website-card";
import { CreateWebsiteForm } from "@/features/websites/components/create-website-form";
import { canCreateWebsite } from "@/features/billing/services/billing.service";
import { UpgradePrompt } from "@/features/billing/components/upgrade-prompt";
import { Globe } from "lucide-react";

export const metadata = {
  title: "Websites",
};

export default async function WebsitesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const [websites, permission] = await Promise.all([
    getWebsitesByUserId(session.user.id),
    canCreateWebsite(session.user.id),
  ]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Websites"
        description="Manage your tracked websites."
      />

      {permission.allowed ? (
        <CreateWebsiteForm />
      ) : (
        <UpgradePrompt
          title="Website Limit Reached"
          description={`You are using ${permission.currentCount}/${permission.limit} websites on the ${permission.plan} plan. Upgrade to Pro for more.`}
        />
      )}

      {websites.length === 0 ? (
        <EmptyState
          title="No websites yet"
          description="Add your first website above to start collecting analytics."
          icon={<Globe className="h-8 w-8" />}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {websites.map((website) => (
            <WebsiteCard
              key={website.id}
              id={website.id}
              name={website.name}
              domain={website.domain}
              siteKey={website.siteKey}
            />
          ))}
        </div>
      )}
    </div>
  );
}
