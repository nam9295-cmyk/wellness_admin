import type { MemberStatus } from '../../types/member';

type StatusBadgeProps = {
  status: MemberStatus;
};

const statusClassName: Record<MemberStatus, string> = {
  Stable: 'bg-brand-success/20 text-brand-success',
  Attention: 'bg-brand-error/20 text-brand-error',
  Check: 'bg-atelier-dusty-rose text-atelier-cocoa-strong',
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClassName[status]}`}>{status}</span>;
}
