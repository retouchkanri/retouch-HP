import Link from "next/link";
import { externalLinkProps, isExternalUrl } from "@/lib/site";

export default function SiteLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  if (isExternalUrl(href)) {
    return (
      <a href={href} className={className} {...externalLinkProps}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
