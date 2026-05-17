interface PageLayoutProps {
  children: React.ReactNode;
  leftWing?: React.ReactNode;
  rightWing?: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
}

export function PageLayout({
  children,
  leftWing,
  rightWing,
  fullWidth,
  className,
}: PageLayoutProps) {
  return (
    <div
      className={`grid w-full flex-1 ${className ?? ""}`}
      style={{
        gridTemplateColumns: fullWidth
          ? "minmax(1rem, 2rem) 1fr minmax(1rem, 2rem)"
          : "minmax(1rem, 1fr) min(var(--content-max-w), 100% - 2rem) minmax(1rem, 1fr)",
      }}
    >
      <div className="min-w-0">{leftWing}</div>
      <div className="min-w-0">{children}</div>
      <div className="min-w-0">{rightWing}</div>
    </div>
  );
}
