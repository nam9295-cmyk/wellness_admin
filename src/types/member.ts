export type MemberStatus = 'Stable' | 'Attention' | 'Check';

export type AdminUserRole = 'superAdmin' | 'orgAdmin';

export type UserRole = AdminUserRole | 'parent';

export type AdminUserStatus = 'active' | 'invited' | 'disabled';

export type OrganizationStatus = 'active' | 'inactive' | 'suspended';

export type OrganizationType = 'wellness' | 'care' | 'test';

export type MemberRole = 'member' | 'tester';

export type NoteVisibility = 'admin_only' | 'parent_visible' | 'member_visible';

export type WellnessMetric = {
  label: '수면' | '기분' | '스트레스' | '피로' | '집중';
  value: string;
  summaryLabel: string;
  trend: string;
  note: string;
};

export type DailyStatus = {
  day: string;
  status: MemberStatus;
  summary: string;
  parentSummary: string;
};

export type SavedTea = {
  name: string;
  reason: string;
  savedAt: string;
};

export type Organization = {
  id: string;
  name: string;
  type: OrganizationType;
  status: OrganizationStatus;
  isTestOrganization: boolean;
  ownerAdminUid: string;
  memberCount: number;
  activeMemberCount: number;
  lastActivityAt: string;
  createdAt: string;
};

export type AdminUser = {
  uid: string;
  name: string;
  email: string;
  role: AdminUserRole;
  organizationId: string | null;
  status: AdminUserStatus;
};

export type ParentConnection = {
  guardianName: string | null;
  relationship: string;
  connected: boolean;
  lastSharedAt: string;
  channel: string;
  nextShareNote: string;
};

export type CareNote = {
  id: string;
  memberId: string;
  authorId: string;
  content: string;
  visibility: NoteVisibility;
  category: 'care_point' | 'internal_memo' | 'parent_briefing';
  createdAt: string;
};

export type ParentChildLink = {
  id: string;
  parentUserId: string;
  childMemberId: string;
  relationship: string;
  linkedAt: string;
  status: 'active' | 'pending' | 'revoked';
  visibilityLevel: 'summary' | 'detailed';
  notificationChannel: 'app' | 'kakao' | 'sms';
  approvedBy: string;
};

export type Member = {
  id: string;
  name: string;
  age: number;
  room: string;
  group: string;
  organizationId: string;
  organizationName: string;
  role: MemberRole;
  isTestAccount: boolean;
  testGroup: string | null;
  status: MemberStatus;
  lastActiveAt: string;
  lastCheckTime: string;
  todayRecommendedTea: string;
  todayTeaId?: string;
  todayFocus: string;
  note: string;
  carePoint: string;
  parentConnection: ParentConnection;
  metrics: WellnessMetric[];
  savedTeas: SavedTea[];
  weeklyStatus: DailyStatus[];
};

export type ParentChildView = {
  childId: string;
  childName: string;
  group: string;
  status: MemberStatus;
  lastCheckTime: string;
  todayChecked: boolean;
  todayMood: string;
  sleepHours: string;
  stress?: string;
  fatigue: string;
  focus: string;
  todayTea: string;
  carePoints: string[];
  recentTrend: DailyStatus[];
  encouragements: { date: string; message: string }[];
  rewardCount: number;
};
