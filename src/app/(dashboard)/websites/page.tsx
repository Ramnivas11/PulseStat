import { auth } from "@/lib/auth";

import { prisma } from "@/lib/prisma";

import { PageHeader } from "@/components/shared/page-header";

import { EmptyState } from "@/components/shared/empty-state";

import { WebsiteCard } from "@/components/dashboard/website-card";

import { CreateWebsiteForm } from "@/components/dashboard/create-website-form";

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

  return (
    <div className="space-y-8">
      <PageHeader
        title="Websites"
        description="Manage your tracked websites."
      />

      <CreateWebsiteForm />

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