import { useState } from 'react';

interface AddMemberForm {
  name: string;
  group: string;
  room: string;
  age: string;
  parentSharingEnabled: boolean;
  todayRecommendedTea: string;
}

const INITIAL_FORM: AddMemberForm = {
  name: '',
  group: '',
  room: '',
  age: '',
  parentSharingEnabled: false,
  todayRecommendedTea: '',
};

const GROUP_OPTIONS = ['해바라기반', '은하수반', '푸른반'];

interface AddMemberModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (form: AddMemberForm) => void;
}

export function AddMemberModal({ open, onClose, onSubmit }: AddMemberModalProps) {
  const [form, setForm] = useState<AddMemberForm>(INITIAL_FORM);

  if (!open) return null;

  function handleChange(field: keyof AddMemberForm, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
    setForm(INITIAL_FORM);
  }

  const isValid = form.name.trim().length > 0 && form.group.length > 0 && form.room.trim().length > 0 && form.age.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
        role="button"
        tabIndex={-1}
        aria-label="모달 닫기"
      />

      {/* Modal */}
      <div className="relative mx-4 w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">회원 등록</h3>
            <p className="mt-1 text-sm text-slate-500">새 회원의 기본 정보를 입력합니다</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 이름 */}
          <div>
            <label htmlFor="member-name" className="mb-1.5 block text-sm font-medium text-slate-700">
              이름 <span className="text-rose-500">*</span>
            </label>
            <input
              id="member-name"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500"
              placeholder="회원 이름"
            />
          </div>

          {/* 그룹 + 방/호실 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="member-group" className="mb-1.5 block text-sm font-medium text-slate-700">
                그룹 <span className="text-rose-500">*</span>
              </label>
              <select
                id="member-group"
                value={form.group}
                onChange={(e) => handleChange('group', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-500"
              >
                <option value="">선택</option>
                {GROUP_OPTIONS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="member-room" className="mb-1.5 block text-sm font-medium text-slate-700">
                방/호실 <span className="text-rose-500">*</span>
              </label>
              <input
                id="member-room"
                value={form.room}
                onChange={(e) => handleChange('room', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500"
                placeholder="A-201"
              />
            </div>
          </div>

          {/* 나이 */}
          <div>
            <label htmlFor="member-age" className="mb-1.5 block text-sm font-medium text-slate-700">
              나이 <span className="text-rose-500">*</span>
            </label>
            <input
              id="member-age"
              type="number"
              min="0"
              max="150"
              value={form.age}
              onChange={(e) => handleChange('age', e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500"
              placeholder="78"
            />
          </div>

          {/* 가족 공유 허용 */}
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5">
            <div>
              <p className="text-sm font-medium text-slate-700">가족 공유 허용</p>
              <p className="mt-0.5 text-xs text-slate-500">활성화 시 가족 홈에서 컨디션 요약을 볼 수 있습니다</p>
            </div>
            <button
              type="button"
              onClick={() => handleChange('parentSharingEnabled', !form.parentSharingEnabled)}
              className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                form.parentSharingEnabled ? 'bg-teal-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  form.parentSharingEnabled ? 'translate-x-5' : ''
                }`}
              />
            </button>
          </div>

          {/* 오늘 추천 블렌드 (선택) */}
          <div>
            <label htmlFor="member-tea" className="mb-1.5 block text-sm font-medium text-slate-700">
              오늘 추천 블렌드 <span className="text-xs text-slate-400">(선택)</span>
            </label>
            <input
              id="member-tea"
              value={form.todayRecommendedTea}
              onChange={(e) => handleChange('todayRecommendedTea', e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500"
              placeholder="캐모마일 블렌드"
            />
          </div>

          {/* 버튼 */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className="rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              등록하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
