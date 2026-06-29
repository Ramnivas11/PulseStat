interface PageHeaderProps {
  title: string;
  description?: string;
}

export function PageHeader({
  title,
  description,
}: PageHeaderProps) {
  return (
    <div className="mb-12 border-b border-border pb-8">
      <h1 className="text-3xl md:text-4xl font-heading font-black tracking-tight uppercase text-foreground mb-3">
        {title}
      </h1>

      {description && (
        <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          {"// " + description}
        </p>
      )}
    </div>
  );
}