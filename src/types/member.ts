export type MemberStatus = 'Stable' | 'Attention' | 'Check';

export type WellnessMetric = {
  label: '수면' | '기분' | '피로' | '집중';
  value: string;
  trend: string;
  note: string;
};

export type DailyStatus = {
  day: string;
  status: MemberStatus;
  summary: string;
};

export type ParentConnection = {
  guardianName: string | null;
  relationship: string;
  connected: boolean;
  lastSharedAt: string;
  channel: string;
  nextShareNote: string;
};

export type Member = {
  id: string;
  name: string;
  age: number;
  room: string;
  group: string;
  status: MemberStatus;
  lastCheckTime: string;
  todayRecommendedTea: string;
  todayFocus: string;
  note: string;
  carePoint: string;
  parentConnection: ParentConnection;
  metrics: WellnessMetric[];
  weeklyStatus: DailyStatus[];
};
