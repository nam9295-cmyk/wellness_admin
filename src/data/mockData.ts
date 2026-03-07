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
    group: '해바라기반',
    status: 'Stable',
    lastCheckTime: '2026-03-07 09:20',
    todayRecommendedTea: '캐모마일 티',
    note: '아침 식사 및 복약 완료. 오전 스트레칭 참여율이 높고 대화 반응도 안정적입니다.',
    carePoint: '점심 이후 수분 섭취를 한 번 더 체크하면 좋습니다.',
    parentConnection: {
      guardianName: '이민수',
      relationship: '아들',
      connected: true,
      lastSharedAt: '2026-03-07 10:10',
      channel: '앱 알림',
    },
    metrics: [
      { label: '수면', value: '7.5시간', trend: '안정', note: '기상 후 컨디션 양호' },
      { label: '기분', value: '좋음', trend: '상승', note: '오전 대화 참여 활발' },
      { label: '피로', value: '낮음', trend: '유지', note: '오후 활동 가능' },
      { label: '집중', value: '보통', trend: '안정', note: '그룹 활동 참여 무난' },
    ],
    weeklyStatus: [
      { day: '03.01', status: 'Stable', summary: '식사, 수면 모두 안정적' },
      { day: '03.02', status: 'Stable', summary: '산책 참여' },
      { day: '03.03', status: 'Check', summary: '오후 피로도 체크' },
      { day: '03.04', status: 'Stable', summary: '복약 정상' },
      { day: '03.05', status: 'Stable', summary: '식사량 양호' },
      { day: '03.06', status: 'Stable', summary: '정서 상태 안정' },
      { day: '03.07', status: 'Stable', summary: '오전 체크 완료' },
    ],
  },
  {
    id: 'm-002',
    name: '박서준',
    age: 82,
    room: 'B-103',
    group: '은하수반',
    status: 'Attention',
    lastCheckTime: '2026-03-07 08:40',
    todayRecommendedTea: '루이보스 티',
    note: '아침 측정에서 혈압 편차가 있어 재측정 예정입니다. 오전 활동은 가볍게 조정했습니다.',
    carePoint: '점심 전 혈압 재측정 후 보호자에게 짧은 브리핑 전송 권장.',
    parentConnection: {
      guardianName: '박수연',
      relationship: '딸',
      connected: true,
      lastSharedAt: '2026-03-06 18:20',
      channel: '카카오 알림',
    },
    metrics: [
      { label: '수면', value: '5.8시간', trend: '하락', note: '야간 중간 각성 2회' },
      { label: '기분', value: '보통', trend: '유지', note: '대화는 가능하나 반응 느림' },
      { label: '피로', value: '높음', trend: '상승', note: '오전 피로감 호소' },
      { label: '집중', value: '낮음', trend: '하락', note: '활동 집중도 저하' },
    ],
    weeklyStatus: [
      { day: '03.01', status: 'Stable', summary: '평균 컨디션 유지' },
      { day: '03.02', status: 'Check', summary: '수면 질 저하' },
      { day: '03.03', status: 'Stable', summary: '활동 참여' },
      { day: '03.04', status: 'Attention', summary: '혈압 변동 관찰' },
      { day: '03.05', status: 'Check', summary: '피로도 증가' },
      { day: '03.06', status: 'Attention', summary: '오후 휴식 증가' },
      { day: '03.07', status: 'Attention', summary: '재측정 필요' },
    ],
  },
  {
    id: 'm-003',
    name: '정유진',
    age: 74,
    room: 'C-305',
    group: '푸른반',
    status: 'Check',
    lastCheckTime: '2026-03-07 10:05',
    todayRecommendedTea: '레몬밤 티',
    note: '물리치료 일정 전후 컨디션 기록을 확인 중입니다. 피로도 변동을 지켜보는 중입니다.',
    carePoint: '오후 치료 후 기분/피로 재체크가 필요합니다.',
    parentConnection: {
      guardianName: '정현우',
      relationship: '배우자',
      connected: true,
      lastSharedAt: '2026-03-07 09:00',
      channel: '앱 알림',
    },
    metrics: [
      { label: '수면', value: '6.7시간', trend: '유지', note: '수면 패턴은 보통' },
      { label: '기분', value: '보통', trend: '상승', note: '치료 전 긴장감 있음' },
      { label: '피로', value: '보통', trend: '상승', note: '치료일에 변동 있음' },
      { label: '집중', value: '좋음', trend: '유지', note: '상담 반응 양호' },
    ],
    weeklyStatus: [
      { day: '03.01', status: 'Stable', summary: '주말 컨디션 양호' },
      { day: '03.02', status: 'Stable', summary: '그룹 활동 참여' },
      { day: '03.03', status: 'Check', summary: '치료 일정 조정' },
      { day: '03.04', status: 'Check', summary: '오후 피로도 관찰' },
      { day: '03.05', status: 'Stable', summary: '기분 회복' },
      { day: '03.06', status: 'Check', summary: '수면 보통' },
      { day: '03.07', status: 'Check', summary: '치료 전 체크' },
    ],
  },
  {
    id: 'm-004',
    name: '최도윤',
    age: 80,
    room: 'A-104',
    group: '해바라기반',
    status: 'Stable',
    lastCheckTime: '2026-03-07 09:55',
    todayRecommendedTea: '보이차',
    note: '오후 산책 참여 예정이며 오전 컨디션은 안정적입니다.',
    carePoint: '산책 후 피로도와 수분 섭취 체크 정도만 유지하면 됩니다.',
    parentConnection: {
      guardianName: null,
      relationship: '보호자 미연결',
      connected: false,
      lastSharedAt: '연결 필요',
      channel: '미설정',
    },
    metrics: [
      { label: '수면', value: '7.0시간', trend: '유지', note: '무난한 수면' },
      { label: '기분', value: '좋음', trend: '유지', note: '산책 기대감 표현' },
      { label: '피로', value: '낮음', trend: '안정', note: '오전 활동 가능' },
      { label: '집중', value: '좋음', trend: '상승', note: '프로그램 몰입도 높음' },
    ],
    weeklyStatus: [
      { day: '03.01', status: 'Stable', summary: '주말 활동 무난' },
      { day: '03.02', status: 'Stable', summary: '식사량 양호' },
      { day: '03.03', status: 'Stable', summary: '활동 참여 우수' },
      { day: '03.04', status: 'Stable', summary: '컨디션 안정' },
      { day: '03.05', status: 'Stable', summary: '집중도 높음' },
      { day: '03.06', status: 'Stable', summary: '산책 참여' },
      { day: '03.07', status: 'Stable', summary: '오전 체크 완료' },
    ],
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
