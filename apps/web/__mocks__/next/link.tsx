const Link = ({
  children,
  href,
  className,
}: {
  children: React.ReactNode
  href: string
  className?: string
}) => <a href={href} className={className}>{children}</a>

export default Link
