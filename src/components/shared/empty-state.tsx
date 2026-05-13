interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-muted bg-card/30 p-12 text-center glass shadow-sm transition-all hover:border-primary/30">
      {icon && (
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
          {icon}
        </div>
      )}
      <h3 className="text-2xl font-extrabold tracking-tight text-foreground">
        {title}
      </h3>
      <p className="mt-3 text-base text-muted-foreground max-w-sm leading-relaxed">
        {description}
      </p>
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}