import { auth } from "@/lib/auth";

import { prisma } from "@/lib/prisma";

import { PageHeader } from "@/components/shared/page-header";

import { EmptyState } from "@/components/shared/empty-state";

import { WebsiteCard } from "@/features/websites/components/website-card";

import { CreateWebsiteForm } from "@/features/websites/components/create-website-form";

import { canCreateWebsite } from "@/features/billing/services/billing.service";
import { UpgradePrompt } from "@/features/billing/components/upgrade-prompt";

export default async function WebsitesPage() {
  const session = await auth();

  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email || "",
    },

    include: {
      websites: true,
    },
  });

  if (!user) return null;

  const permission = await canCreateWebsite(user.id);

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
          description={`You are using ${permission.currentCount}/${permission.limit} websites on the ${permission.plan} plan. Upgrade to Pro for unlimited websites.`} 
        />
      )}

      {user?.websites.length === 0 ? (
        <EmptyState
          title="No websites yet"
          description="Create your first website."
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {user?.websites.map((website) => (
            <WebsiteCard
              key={website.id}
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