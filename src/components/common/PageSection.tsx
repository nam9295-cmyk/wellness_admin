import type { PropsWithChildren } from 'react';

type PageSectionProps = PropsWithChildren<{
  title: string;
  description?: string;
}>;

export function PageSection({ title, description, children }: PageSectionProps) {
  return (
    <section className="rounded-3xl border border-atelier-border bg-atelier-surface p-5 shadow-sm sm:p-6">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-atelier-title">{title}</h3>
        {description ? <p className="mt-1 text-sm text-atelier-text-soft">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
