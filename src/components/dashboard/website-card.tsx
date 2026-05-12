import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface WebsiteCardProps {
  name: string;
  domain: string;
  siteKey: string;
}

export function WebsiteCard({
  name,
  domain,
  siteKey,
}: WebsiteCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">
          {domain}
        </p>

        <code className="rounded bg-muted px-2 py-1 text-xs">
          {siteKey}
        </code>
      </CardContent>
    </Card>
  );
}