/**
 * Firestore collection name mapping constants.
 *
 * Firestore uses NEW terminology (blends, conditionNotes, etc.)
 * while code identifiers keep OLD names (tea*, careNote*, etc.).
 * This mapping bridges the two layers.
 *
 * Usage:
 *   collection(db, COLLECTIONS.blends)          // → 'blends'
 *   collection(db, COLLECTIONS.conditionNotes)   // → 'conditionNotes'
 *
 * Subcollection helpers use template functions:
 *   SUBCOLLECTIONS.dailySummaries('member-id')   // → 'members/member-id/dailySummaries'
 *   SUBCOLLECTIONS.parentLinks('member-id')      // → 'members/member-id/parentLinks'
 *   SUBCOLLECTIONS.privateInfo('member-id')      // → 'members/member-id/private'
 */

/** Top-level Firestore collection names */
export const COLLECTIONS = {
  /** Blend catalog (code: tea*) */
  blends: 'blends',

  /** Condition notes — parent-visible (code: careNote*) */
  conditionNotes: 'conditionNotes',

  /** Condition notes — admin-only (code: careNote* internal) */
  conditionNotesPrivate: 'conditionNotesPrivate',

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
