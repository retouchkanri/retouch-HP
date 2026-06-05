import { ReactNode } from "react";

export function Section({
  id,
  children,
  className = "",
  alt = false,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  alt?: boolean;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-28 py-16 sm:py-24 ${alt ? "bg-white" : ""} ${className}`}
    >
      <div className="container-x">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  center = false,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  center?: boolean;
}) {
  return (
    <div className={`max-w-3xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="section-title mt-3">{title}</h2>
      {lead && <p className="section-lead mt-5">{lead}</p>}
      <span
        className={`mt-6 block h-px w-16 bg-gold ${center ? "mx-auto" : ""}`}
      />
    </div>
  );
}
