import type { Member } from '../types/member';

export const summaryCards = [
  { label: '전체 회원', value: '128', change: '+4 this week' },
  { label: '오늘 체크인', value: '94', change: '73% completed' },
  { label: '주의 필요', value: '8', change: '2 new alerts' },
  { label: '보호자 문의', value: '13', change: '5 unread' },
];

export const members: Member[] = [
  {
    id: 'm-001',
    name: '김하늘',
    age: 78,
    room: 'A-201',
    guardian: '이민수',
    status: 'Stable',
    lastCheckTime: '2026-03-07 09:20',
    note: '아침 식사 및 복약 완료',
  },
  {
    id: 'm-002',
    name: '박서준',
    age: 82,
    room: 'B-103',
    guardian: '박수연',
    status: 'Attention',
    lastCheckTime: '2026-03-07 08:40',
    note: '혈압 재측정 필요',
  },
  {
    id: 'm-003',
    name: '정유진',
    age: 74,
    room: 'C-305',
    guardian: '정현우',
    status: 'Check',
    lastCheckTime: '2026-03-07 10:05',
    note: '물리치료 일정 확인 중',
  },
  {
    id: 'm-004',
    name: '최도윤',
    age: 80,
    room: 'A-104',
    guardian: '최은지',
    status: 'Stable',
    lastCheckTime: '2026-03-07 09:55',
    note: '오후 산책 참여 예정',
  },
];

export const parentUpdates = [
  {
    title: '오늘 건강 브리핑',
    description: '보호자에게 전달할 일일 활동/식사/복약 요약 템플릿',
  },
  {
    title: '면회 요청 관리',
    description: '면회 예약 승인, 일정 조정, 응답 상태 확인 영역',
  },
  {
    title: '알림 히스토리',
    description: '문자/앱푸시/카카오 알림 발송 기록을 나중에 연결할 자리',
  },
];

export const settingsGroups = [
  {
    title: '운영 설정',
    items: ['시설 기본 정보', '운영 시간', '담당자 계정'],
  },
  {
    title: '알림 설정',
    items: ['이상 징후 알림', '보호자 알림 채널', '리마인더 빈도'],
  },
  {
    title: '권한 설정',
    items: ['관리자 권한', '보호자 열람 범위', '로그 기록'],
  },
];
