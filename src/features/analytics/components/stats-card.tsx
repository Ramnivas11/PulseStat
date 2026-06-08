import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string;
}

export function StatsCard({
  title,
  value,
}: StatsCardProps) {
  return (
    <Card className="relative hover:border-primary/50 transition-colors duration-200">
      {/* Corner indicators for telemetry look */}
      <div className="absolute top-0 left-0 w-[1px] h-[1px] bg-primary" />
      <div className="absolute top-0 right-0 w-[1px] h-[1px] bg-primary" />
      <div className="absolute bottom-0 left-0 w-[1px] h-[1px] bg-primary" />
      <div className="absolute bottom-0 right-0 w-[1px] h-[1px] bg-primary" />
      
      <CardHeader className="pb-1">
        <span className="font-mono text-[9px] tracking-widest text-muted-foreground/60 uppercase">
          {"// "}{title}
        </span>
      </CardHeader>

      <CardContent className="pb-4">
        <p className="text-3xl font-mono font-bold tracking-tight text-white">
          {value}
        </p>
      </CardContent>
    </Card>
  );
}