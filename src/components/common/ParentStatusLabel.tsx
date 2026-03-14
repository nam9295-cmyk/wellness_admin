import type { MemberStatus } from '../../types/member';

type ParentStatusLabelProps = {
  status: MemberStatus;
};

const parentStatusMap: Record<MemberStatus, { label: string; className: string }> = {
  Stable: { label: '안정적이에요', className: 'bg-brand-success/20 text-brand-success' },
  Attention: { label: '살펴보는 중이에요', className: 'bg-brand-error/20 text-brand-error' },
  Check: { label: '확인 중이에요', className: 'bg-brand-primary-light text-brand-primary' },
};

export function ParentStatusLabel({ status }: ParentStatusLabelProps) {
  const { label, className } = parentStatusMap[status];
  return <span className={`inline-block rounded-full px-4 py-1.5 text-sm font-medium ${className}`}>{label}</span>;
}
