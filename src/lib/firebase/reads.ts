/**
 * Typed Firestore read helpers.
 *
 * Phase 2A: Read-only access to Firestore collections.
 * These functions use NEW Firestore collection names (blends, conditionNotes)
 * but return data shaped to match existing code types (SavedTea, CareNote, etc.).
 *
 * IMPORTANT:
 * - Code identifiers (tea*, careNote*) are NOT renamed — that's Phase 2B.
 * - These helpers are additive — existing mockData imports remain untouched.
 * - No writes. Read-only.
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,

} from 'firebase/firestore';
import { db } from '../firebase';
import { COLLECTIONS, SUBCOLLECTIONS } from './collections';
import type {
  AdminUserRole,
  AdminUserStatus,
  MemberRole,
  MemberStatus,
  NoteVisibility,
  OrganizationStatus,
  OrganizationType,
} from '../../types/member';

// ---------------------------------------------------------------------------
// Firestore document types (what Firestore stores)
// These map to our code types but live in Firestore with new field names.
// ---------------------------------------------------------------------------

/** Firestore: blends/{blendId} */
export interface BlendDoc {
  id: string;
  name: string;
  nameKo: string;
  category: string;
  description: string;
  ingredients: string[];
  benefits: string[];
  imageUrl?: string;
}

/** Firestore: members/{memberId} (public-safe fields) */
export interface MemberDoc {
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
  todayBlendId: string;
  todayBlendName: string;
  todayFocus: string;
  note: string;
  facilityId?: string;
  userId?: string;
}

/** Firestore: organizations/{organizationId} */
export interface OrganizationDoc {
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
}

/** Firestore: adminUsers/{uid} */
export interface AdminUserDoc {
  uid: string;
  name: string;
  email: string;
  role: AdminUserRole;
  organizationId: string | null;
  status: AdminUserStatus;
}

/** Firestore: members/{memberId}/dailySummaries/{date} */
export interface DailySummaryDoc {
  id: string;
  date: string;
  status: MemberStatus;
  adminSummary: string;
  parentSummary: string;
  blendName: string;
  mood?: string | number;
  sleep?: string | number;
  stress?: string | number;
  fatigue?: string | number;
  focus?: string | number;
  meal?: string | number;
  exercise?: string | number;
  water?: string | number;
}

/** Firestore: members/{memberId}/conditionNotes/{noteId} */
export interface ConditionNoteDoc {
  id: string;
  memberId: string;
  authorId: string;
  content: string;
  visibility: NoteVisibility;
  category: 'care_point' | 'internal_memo' | 'parent_briefing';
  createdAt: string;
}

/** Firestore: members/{memberId}/savedTeas/{teaId} */
export interface SavedTeaDoc {
  id: string;
  teaId: string;
  savedAt: string;
  reason: string;
}

function toDateText(value: unknown): string {
  if (typeof value === 'string') return value;
  if (value instanceof Date) return value.toISOString().slice(0, 16).replace('T', ' ');
  if (value && typeof value === 'object' && 'toDate' in value && typeof value.toDate === 'function') {
    const date = value.toDate();
    return date instanceof Date && !Number.isNaN(date.getTime())
      ? date.toISOString().slice(0, 16).replace('T', ' ')
      : '';
  }
  return '';
}

// ---------------------------------------------------------------------------
// Read helpers
// ---------------------------------------------------------------------------

/**
 * Fetch all blends from the catalog.
 * Firestore collection: 'blends'
 */
export async function fetchBlends(): Promise<BlendDoc[]> {
  const snapshot = await getDocs(collection(db, COLLECTIONS.blends));
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as BlendDoc[];
}

/**
 * Fetch a single blend by ID.
 * Firestore document: 'blends/{blendId}'
 */
export async function fetchBlendById(blendId: string): Promise<BlendDoc | null> {
  const docSnap = await getDoc(doc(db, COLLECTIONS.blends, blendId));
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as BlendDoc;
}

/**
 * Fetch all members (top-level public-safe fields).
 * Firestore collection: 'members'
 */
export async function fetchMembers(): Promise<MemberDoc[]> {
  const snapshot = await getDocs(collection(db, COLLECTIONS.members));
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as MemberDoc[];
}

/**
 * Fetch members filtered by organization.
 * Firestore collection: 'members' where organizationId == organizationId
 */
export async function fetchMembersByOrganization(organizationId: string): Promise<MemberDoc[]> {
  const q = query(
    collection(db, COLLECTIONS.members),
    where('organizationId', '==', organizationId),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as MemberDoc[];
}

/**
 * Legacy helper kept for backward compatibility.
 * Prefer fetchMembersByOrganization() for new admin scope work.
 */
export async function fetchMembersByFacility(facilityId: string): Promise<MemberDoc[]> {
  const q = query(
    collection(db, COLLECTIONS.members),
    where('facilityId', '==', facilityId),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as MemberDoc[];
}

/**
 * Fetch a single member by ID.
 * Firestore document: 'members/{memberId}'
 */
export async function fetchMemberById(memberId: string): Promise<MemberDoc | null> {
  const docSnap = await getDoc(doc(db, COLLECTIONS.members, memberId));
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as MemberDoc;
}

export async function fetchOrganizations(): Promise<OrganizationDoc[]> {
  const snapshot = await getDocs(collection(db, COLLECTIONS.organizations));
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as OrganizationDoc[];
}

export async function fetchOrganizationById(organizationId: string): Promise<OrganizationDoc | null> {
  const docSnap = await getDoc(doc(db, COLLECTIONS.organizations, organizationId));
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as OrganizationDoc;
}

export async function fetchAdminUserById(uid: string): Promise<AdminUserDoc | null> {
  const docSnap = await getDoc(doc(db, COLLECTIONS.adminUsers, uid));
  if (!docSnap.exists()) return null;
  return { uid: docSnap.id, ...docSnap.data() } as AdminUserDoc;
}

/**
 * Fetch daily summaries for a member.
 * Firestore subcollection: 'members/{memberId}/dailySummaries'
 *
 * @param memberId - The member's document ID
 * @param limitCount - Max number of summaries to return (default 7 = one week)
 */
export async function fetchDailySummaries(
  memberId: string,
  limitCount = 7,
): Promise<DailySummaryDoc[]> {
  const q = query(
    collection(db, SUBCOLLECTIONS.dailySummaries(memberId)),
    orderBy('date', 'desc'),
    limit(limitCount),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as DailySummaryDoc[];
}

/**
 * Fetch condition notes (parent-visible) for a member.
 * Firestore subcollection: 'members/{memberId}/conditionNotes'
 *
 * @param memberId - The member's document ID
 * @param limitCount - Max notes to return (default 20)
 */
export async function fetchConditionNotes(
  memberId: string,
  limitCount = 20,
): Promise<ConditionNoteDoc[]> {
  const q = query(
    collection(db, SUBCOLLECTIONS.conditionNotes(memberId)),
    orderBy('createdAt', 'desc'),
    limit(limitCount),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as ConditionNoteDoc[];
}

/**
 * Fetch condition notes (admin-only / private) for a member.
 * Firestore subcollection: 'members/{memberId}/conditionNotesPrivate'
 *
 * @param memberId - The member's document ID
 * @param limitCount - Max notes to return (default 20)
 */
export async function fetchConditionNotesPrivate(
  memberId: string,
  limitCount = 20,
): Promise<ConditionNoteDoc[]> {
  const q = query(
    collection(db, SUBCOLLECTIONS.conditionNotesPrivate(memberId)),
    orderBy('createdAt', 'desc'),
    limit(limitCount),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as ConditionNoteDoc[];
}

/**
 * Fetch ALL condition notes for a member (both parent-visible and admin-only).
 * Merges results from conditionNotes + conditionNotesPrivate, sorted by createdAt desc.
 *
 * For admin view only — parents should use fetchConditionNotes() which only returns
 * parent-visible notes (enforcement also happens at Security Rules level).
 */
export async function fetchAllConditionNotesForMember(
  memberId: string,
  limitCount = 20,
): Promise<ConditionNoteDoc[]> {
  const [visible, priv] = await Promise.all([
    fetchConditionNotes(memberId, limitCount),
    fetchConditionNotesPrivate(memberId, limitCount),
  ]);

  return [...visible, ...priv].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

/**
 * Fetch saved teas for a member.
 * Firestore subcollection: 'members/{memberId}/savedTeas'
 *
 * Document ID is expected to be the teaId.
 * Additional fields are optional and normalized defensively.
 */
export async function fetchSavedTeas(
  memberId: string,
  limitCount = 20,
): Promise<SavedTeaDoc[]> {
  const snapshot = await getDocs(collection(db, SUBCOLLECTIONS.savedTeas(memberId)));

  return snapshot.docs
    .map((d) => {
      const data = d.data() as Record<string, unknown>;
      return {
        id: d.id,
        teaId: typeof data.teaId === 'string' && data.teaId.length > 0 ? data.teaId : d.id,
        savedAt: toDateText(data.savedAt ?? data.createdAt ?? data.updatedAt),
        reason:
          typeof data.reason === 'string' && data.reason.length > 0
            ? data.reason
            : typeof data.note === 'string' && data.note.length > 0
              ? data.note
              : typeof data.memo === 'string' && data.memo.length > 0
                ? data.memo
                : '앱에서 저장된 블렌드',
      };
    })
    .sort((a, b) => {
      const aTime = a.savedAt ? new Date(a.savedAt).getTime() : 0;
      const bTime = b.savedAt ? new Date(b.savedAt).getTime() : 0;
      return bTime - aTime;
    })
    .slice(0, limitCount);
}
