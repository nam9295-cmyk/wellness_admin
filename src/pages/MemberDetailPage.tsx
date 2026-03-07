import { Link, useParams } from 'react-router-dom';
import { PageSection } from '../components/common/PageSection';
import { members } from '../data/mockData';

export function MemberDetailPage() {
  const { memberId } = useParams();
  const member = members.find((item) => item.id === memberId);

  if (!member) {
    return (
      <PageSection title="회원 정보를 찾을 수 없습니다">
        <Link to="/members" className="text-sm font-semibold text-teal-700 hover:text-teal-800">
          목록으로 돌아가기
        </Link>
      </PageSection>
    );
  }

  return (
    <div className="space-y-6">
      <PageSection title={`${member.name} 상세`} description="회원 상세 화면의 기본 카드 구조 예시">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-slate-100 p-4">
            <p className="text-sm text-slate-500">호실</p>
            <p className="mt-2 text-xl font-semibold">{member.room}</p>
          </div>
          <div className="rounded-2xl bg-slate-100 p-4">
            <p className="text-sm text-slate-500">보호자</p>
            <p className="mt-2 text-xl font-semibold">{member.guardian}</p>
          </div>
          <div className="rounded-2xl bg-slate-100 p-4">
            <p className="text-sm text-slate-500">상태</p>
            <p className="mt-2 text-xl font-semibold">{member.status}</p>
          </div>
          <div className="rounded-2xl bg-slate-100 p-4">
            <p className="text-sm text-slate-500">최근 체크</p>
            <p className="mt-2 text-xl font-semibold">{member.lastCheckTime}</p>
          </div>
        </div>
      </PageSection>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <PageSection title="기본 메모" description="건강 기록, 생활 메모, 상담 내용 등이 들어올 영역">
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">{member.note}</div>
        </PageSection>

        <PageSection title="다음 액션" description="추후 버튼/폼이 들어갈 액션 슬롯">
          <div className="space-y-3">
            <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-800">건강 체크 기록 보기</div>
            <div className="rounded-2xl bg-sky-50 p-4 text-sm text-sky-800">보호자 공유 브리핑 작성</div>
            <div className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-800">주의 메모 등록</div>
          </div>
        </PageSection>
      </div>
    </div>
  );
}
