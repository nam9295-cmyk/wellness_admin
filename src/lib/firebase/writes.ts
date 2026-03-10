/**
 * Firestore write helpers.
 * Phase 2A: 회원 등록 + 기본 하위 데이터 자동 생성.
 * Phase 2B: organizations / adminUsers / organization-scoped members 구조 추가.
 */

import { collection, doc, setDoc, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';
import { COLLECTIONS, SUBCOLLECTIONS } from './collections';
import type {
  AdminUserRole,
  AdminUserStatus,
  MemberRole,
  OrganizationStatus,
  OrganizationType,
} from '../../types/member';

interface AddMemberData {
  name: string;
  group: string;
  room: string;
  age: number;
  organizationId: string;
  organizationName: string;
  role: MemberRole;
  isTestAccount: boolean;
  testGroup: string | null;
  status: string;
  lastActiveAt: string;
  todayBlendName: string;
  todayBlendId: string;
  todayFocus: string;
  note: string;
  facilityId?: string;
  lastCheckTime: string;
}

interface CreateOrganizationData {
  organizationId?: string;
  name: string;
  type: OrganizationType;
  status: OrganizationStatus;
  isTestOrganization: boolean;
  ownerAdminUid: string;
  memberCount?: number;
  activeMemberCount?: number;
  lastActivityAt?: string;
  createdAt?: string;
}

interface UpsertAdminUserData {
  uid: string;
  name: string;
  email: string;
  role: AdminUserRole;
  organizationId: string | null;
  status: AdminUserStatus;
}

interface CreateTestOrganizationBundleData {
  organizationId: string;
  organizationName: string;
  ownerAdminUid: string;
  ownerName: string;
  ownerEmail: string;
  testGroup?: string;
}

/**
 * 새 회원을 Firestore에 등록합니다.
 *
 * 단일 batch write로 아래 데이터를 원자적으로 생성:
 * 1. members/{id} — 회원 기본 문서
 * 2. members/{id}/dailySummaries/{today} — 오늘의 초기 요약
 * 3. members/{id}/conditionNotes/{auto} — 등록 시점 초기 컨디션 노트
 *
 * @returns 생성된 회원 문서 ID
 */
export async function addMember(data: AddMemberData): Promise<string> {
  const batch = writeBatch(db);

  // 1. 회원 기본 문서 (자동 ID 생성)
  const memberRef = doc(collection(db, COLLECTIONS.members));
  batch.set(memberRef, {
    ...data,
    facilityId: data.facilityId ?? data.organizationId,
  });

  // 2. 오늘의 일일 요약 초기값
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const now = new Date().toISOString().slice(0, 16).replace('T', ' '); // YYYY-MM-DD HH:mm
  const summaryRef = doc(
    collection(db, SUBCOLLECTIONS.dailySummaries(memberRef.id)),
    today,
  );
  batch.set(summaryRef, {
    date: today,
    status: data.status || 'Stable',
    adminSummary: '신규 등록 회원입니다. 초기 체크가 필요합니다.',
    parentSummary: '새로 등록되어 선생님이 살펴보고 있어요.',
    blendName: data.todayBlendName || '',
    mood: '',
    sleep: '',
    fatigue: '',
    focus: '',
  });

  // 3. 초기 컨디션 노트 (내부 전용, 서브컨렉션)
  const noteRef = doc(collection(db, SUBCOLLECTIONS.conditionNotes(memberRef.id)));
  batch.set(noteRef, {
    memberId: memberRef.id,
    authorId: 'system',
    content: `${data.name} 회원이 신규 등록되었습니다. 초기 컨디션 체크를 진행해 주세요.`,
    visibility: 'admin_only',
    category: 'internal_memo',
    createdAt: now,
  });

  await batch.commit();
  return memberRef.id;
}

export async function createOrganization(data: CreateOrganizationData): Promise<string> {
  const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
  const organizationRef = data.organizationId
    ? doc(db, COLLECTIONS.organizations, data.organizationId)
    : doc(collection(db, COLLECTIONS.organizations));

  await setDoc(organizationRef, {
    name: data.name,
    type: data.type,
    status: data.status,
    isTestOrganization: data.isTestOrganization,
    ownerAdminUid: data.ownerAdminUid,
    memberCount: data.memberCount ?? 0,
    activeMemberCount: data.activeMemberCount ?? 0,
    lastActivityAt: data.lastActivityAt ?? now,
    createdAt: data.createdAt ?? now,
  }, { merge: true });

  return organizationRef.id;
}

export async function upsertAdminUser(data: UpsertAdminUserData): Promise<string> {
  const adminUserRef = doc(db, COLLECTIONS.adminUsers, data.uid);

  await setDoc(adminUserRef, {
    uid: data.uid,
    name: data.name,
    email: data.email,
    role: data.role,
    organizationId: data.organizationId,
    status: data.status,
  }, { merge: true });

  return data.uid;
}

export async function createTestOrganizationBundle(
  data: CreateTestOrganizationBundleData,
): Promise<{ organizationId: string; adminUid: string }> {
  const now = new Date().toISOString().slice(0, 16).replace('T', ' ');

  const organizationId = await createOrganization({
    organizationId: data.organizationId,
    name: data.organizationName,
    type: 'test',
    status: 'active',
    isTestOrganization: true,
    ownerAdminUid: data.ownerAdminUid,
    lastActivityAt: now,
    createdAt: now,
  });

  await upsertAdminUser({
    uid: data.ownerAdminUid,
    name: data.ownerName,
    email: data.ownerEmail,
    role: 'orgAdmin',
    organizationId,
    status: 'active',
  });

  return {
    organizationId,
    adminUid: data.ownerAdminUid,
  };
}

export async function seedAdminTestData(): Promise<{
  superAdminUid: string;
  organizationIds: string[];
}> {
  const now = new Date().toISOString().slice(0, 16).replace('T', ' ');

  await upsertAdminUser({
    uid: 'admin-super-001',
    name: '플랫폼 총괄 관리자',
    email: 'superadmin@wellness.test',
    role: 'superAdmin',
    organizationId: null,
    status: 'active',
  });

  const alpha = await createTestOrganizationBundle({
    organizationId: 'org-test-alpha',
    organizationName: '웰니스 테스트 알파',
    ownerAdminUid: 'admin-org-alpha',
    ownerName: '알파 조직 관리자',
    ownerEmail: 'alpha-admin@wellness.test',
    testGroup: 'alpha',
  });

  const beta = await createTestOrganizationBundle({
    organizationId: 'org-test-beta',
    organizationName: '웰니스 테스트 베타',
    ownerAdminUid: 'admin-org-beta',
    ownerName: '베타 조직 관리자',
    ownerEmail: 'beta-admin@wellness.test',
    testGroup: 'beta',
  });

  await addMember({
    name: '테스터 알파 1',
    group: '테스트반',
    room: 'T-A01',
    age: 71,
    organizationId: alpha.organizationId,
    organizationName: '웰니스 테스트 알파',
    role: 'tester',
    isTestAccount: true,
    testGroup: 'alpha',
    status: 'Stable',
    lastActiveAt: now,
    todayBlendName: '캐모마일 블렌드',
    todayBlendId: '',
    todayFocus: '테스트 시나리오 확인',
    note: 'alpha 조직 테스트 멤버',
    lastCheckTime: now,
  });

  await addMember({
    name: '테스터 베타 1',
    group: '테스트반',
    room: 'T-B01',
    age: 74,
    organizationId: beta.organizationId,
    organizationName: '웰니스 테스트 베타',
    role: 'tester',
    isTestAccount: true,
    testGroup: 'beta',
    status: 'Check',
    lastActiveAt: now,
    todayBlendName: '루이보스 블렌드',
    todayBlendId: '',
    todayFocus: '테스트 시나리오 확인',
    note: 'beta 조직 테스트 멤버',
    lastCheckTime: now,
  });

  return {
    superAdminUid: 'admin-super-001',
    organizationIds: [alpha.organizationId, beta.organizationId],
  };
}
