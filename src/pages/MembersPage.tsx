import { Link } from 'react-router-dom';
import { PageSection } from '../components/common/PageSection';
import { members } from '../data/mockData';

export function MembersPage() {
  return (
    <PageSection title="회원 목록" description="실데이터 연결 전, 목록/상세 플로우를 먼저 확인하는 더미 화면">
      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <div className="grid grid-cols-[1.2fr_0.7fr_0.8fr_1fr_0.8fr] gap-4 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600">
          <span>이름</span>
          <span>나이</span>
          <span>호실</span>
          <span>보호자</span>
          <span>상세</span>
        </div>

        {members.map((member) => (
          <div
            key={member.id}
            className="grid grid-cols-[1.2fr_0.7fr_0.8fr_1fr_0.8fr] items-center gap-4 border-t border-slate-200 px-4 py-4 text-sm text-slate-700"
          >
            <span className="font-medium text-slate-900">{member.name}</span>
            <span>{member.age}세</span>
            <span>{member.room}</span>
            <span>{member.guardian}</span>
            <Link className="font-semibold text-teal-700 hover:text-teal-800" to={`/members/${member.id}`}>
              상세 보기
            </Link>
          </div>
        ))}
      </div>
    </PageSection>
  );
}
