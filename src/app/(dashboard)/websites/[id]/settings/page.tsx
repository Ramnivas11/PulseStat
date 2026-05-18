import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/page-header";
import { WebsiteCard } from "@/features/websites/components/website-card";
import { EditWebsiteForm } from "@/features/websites/components/edit-website-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata(props: Props) {
  const { id } = await props.params;
  const session = await auth();
  if (!session?.user?.id) return { title: "Settings" };
  const w = await prisma.website.findFirst({ where: { id, userId: session.user.id }, select: { name: true } });
  return { title: w ? `${w.name} — Settings` : "Settings" };
}

export default async function WebsiteSettingsPage(props: Props) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await props.params;
  const website = await prisma.website.findFirst({
    where: { id, userId: session.user.id },
    select: { id: true, name: true, domain: true, siteKey: true },
  });

  if (!website) notFound();

  return (
    <div className="space-y-8 pb-10 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/websites/${id}`}>
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to analytics
          </Link>
        </Button>
      </div>

      <PageHeader
        title={`${website.name} — Settings`}
        description={`Manage configuration for ${website.domain}`}
      />

      {/* Edit name + domain */}
      <Card className="glass border-white/20 shadow-lg">
        <CardHeader className="border-b bg-muted/30">
          <CardTitle className="text-lg font-semibold">Website Details</CardTitle>
          <CardDescription>Update the name and domain of this website.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <EditWebsiteForm
            id={website.id}
            initialName={website.name}
            initialDomain={website.domain}
          />
        </CardContent>
      </Card>

      {/* Tracking snippet */}
      <WebsiteCard
        id={website.id}
        name={website.name}
        domain={website.domain}
        siteKey={website.siteKey}
      />
    </div>
  );
}
