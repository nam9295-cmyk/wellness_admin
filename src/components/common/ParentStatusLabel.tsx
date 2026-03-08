import type { MemberStatus } from '../../types/member';

type ParentStatusLabelProps = {
  status: MemberStatus;
};

const parentStatusMap: Record<MemberStatus, { label: string; className: string }> = {
  Stable: { label: '안정적이에요', className: 'bg-emerald-50 text-emerald-700' },
  Attention: { label: '살펴보는 중이에요', className: 'bg-amber-50 text-amber-700' },
  Check: { label: '확인 중이에요', className: 'bg-sky-50 text-sky-700' },
};

export function ParentStatusLabel({ status }: ParentStatusLabelProps) {
  const { label, className } = parentStatusMap[status];
  return <span className={`inline-block rounded-full px-4 py-1.5 text-sm font-medium ${className}`}>{label}</span>;
}
