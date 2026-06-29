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
    <div className="flex flex-col items-center justify-center rounded-none border border-dashed border-border bg-black p-12 text-center transition-all hover:border-primary/50 relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-border group-hover:bg-primary transition-colors"></div>
      
      {icon && (
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-none bg-primary/10 text-primary border border-primary/20">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-heading font-black tracking-tight text-white uppercase mb-2">
        {title}
      </h3>
      <p className="mt-3 text-[10px] font-mono text-muted-foreground uppercase tracking-wider max-w-sm leading-relaxed">
        {"// " + description}
      </p>
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}