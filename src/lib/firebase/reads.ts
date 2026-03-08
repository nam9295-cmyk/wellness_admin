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
import type { MemberStatus, NoteVisibility } from '../../types/member';

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
  facilityId: string;
  status: MemberStatus;
  lastCheckTime: string;
  todayBlendId: string;
  todayBlendName: string;
  todayFocus: string;
  note: string;
  userId?: string;
}

/** Firestore: members/{memberId}/dailySummaries/{date} */
export interface DailySummaryDoc {
  id: string;
  date: string;
  status: MemberStatus;
  adminSummary: string;
  parentSummary: string;
  blendName: string;
  mood?: string;
  sleep?: string;
  fatigue?: string;
  focus?: string;
}

/** Firestore: conditionNotes/{noteId} */
export interface ConditionNoteDoc {
  id: string;
  memberId: string;
  authorId: string;
  content: string;
  visibility: NoteVisibility;
  category: 'care_point' | 'internal_memo' | 'parent_briefing';
  createdAt: string;
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
 * Fetch members filtered by facility.
 * Firestore collection: 'members' where facilityId == facilityId
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
 * Firestore collection: 'conditionNotes' where memberId == memberId
 *
 * @param memberId - The member's document ID
 * @param limitCount - Max notes to return (default 20)
 */
export async function fetchConditionNotes(
  memberId: string,
  limitCount = 20,
): Promise<ConditionNoteDoc[]> {
  const q = query(
    collection(db, COLLECTIONS.conditionNotes),
    where('memberId', '==', memberId),
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
 * Firestore collection: 'conditionNotesPrivate' where memberId == memberId
 *
 * @param memberId - The member's document ID
 * @param limitCount - Max notes to return (default 20)
 */
export async function fetchConditionNotesPrivate(
  memberId: string,
  limitCount = 20,
): Promise<ConditionNoteDoc[]> {
  const q = query(
    collection(db, COLLECTIONS.conditionNotesPrivate),
    where('memberId', '==', memberId),
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
