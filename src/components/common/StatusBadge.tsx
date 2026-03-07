import type { MemberStatus } from '../../types/member';

type StatusBadgeProps = {
  status: MemberStatus;
};

const statusClassName: Record<MemberStatus, string> = {
  Stable: 'bg-emerald-100 text-emerald-800',
  Attention: 'bg-amber-100 text-amber-800',
  Check: 'bg-sky-100 text-sky-800',
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClassName[status]}`}>{status}</span>;
}
