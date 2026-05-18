interface PageHeaderProps {
  title: string;
  description?: string;
}

export function PageHeader({
  title,
  description,
}: PageHeaderProps) {
  return (
    <div className="mb-10 space-y-2">
      <h1 className="text-3xl md:text-4xl font-black tracking-tighter bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
        {title}
      </h1>

      {description && (
        <p className="text-lg text-muted-foreground/80 max-w-2xl font-medium">
          {description}
        </p>
      )}
    </div>
  );
}