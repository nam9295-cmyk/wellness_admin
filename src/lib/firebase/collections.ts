/**
 * Firestore collection name mapping constants.
 *
 * Firestore uses actual collection names from Firebase Console
 * while code identifiers keep OLD names (tea*, careNote*, etc.).
 * This mapping bridges the two layers.
 *
 * Usage:
 *   collection(db, COLLECTIONS.blends)                    // → 'teas' (Firestore 실제 이름)
 *   collection(db, SUBCOLLECTIONS.conditionNotes('m-1'))   // → 'members/m-1/conditionNotes'
 *
 * Subcollection helpers use template functions:
 *   SUBCOLLECTIONS.dailySummaries('member-id')   // → 'members/member-id/dailySummaries'
 *   SUBCOLLECTIONS.conditionNotes('member-id')   // → 'members/member-id/conditionNotes'
 *   SUBCOLLECTIONS.parentLinks('member-id')      // → 'members/member-id/parentLinks'
 *   SUBCOLLECTIONS.privateInfo('member-id')      // → 'members/member-id/private'
 */

/** Top-level Firestore collection names */
export const COLLECTIONS = {
  /** Blend catalog — Firestore 실제 컬렉션명: 'teas' (UI 표기: 블렌드, code: tea*) */
  blends: 'teas',

  /** Members (no rename needed) */
  members: 'members',

  /** Facilities (no rename needed) */
  facilities: 'facilities',

  /** Users — Firebase Auth profile mirror (no rename needed) */
  users: 'users',
} as const;

/** Subcollection path builders under members/{memberId}/ */
export const SUBCOLLECTIONS = {
  /** members/{memberId}/dailySummaries */
  dailySummaries: (memberId: string) =>
    `${COLLECTIONS.members}/${memberId}/dailySummaries`,

  /** members/{memberId}/conditionNotes — parent-visible (code: careNote*) */
  conditionNotes: (memberId: string) =>
    `${COLLECTIONS.members}/${memberId}/conditionNotes`,

  /** members/{memberId}/conditionNotesPrivate — admin-only (code: careNote* internal) */
  conditionNotesPrivate: (memberId: string) =>
    `${COLLECTIONS.members}/${memberId}/conditionNotesPrivate`,

  /** members/{memberId}/parentLinks */
  parentLinks: (memberId: string) =>
    `${COLLECTIONS.members}/${memberId}/parentLinks`,

  /** members/{memberId}/private (admin-only sensitive fields) */
  privateInfo: (memberId: string) =>
    `${COLLECTIONS.members}/${memberId}/private`,

  /** members/{memberId}/encouragementMessages */
  encouragementMessages: (memberId: string) =>
    `${COLLECTIONS.members}/${memberId}/encouragementMessages`,
} as const;

export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];
