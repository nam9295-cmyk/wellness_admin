/**
 * Firestore write helpers.
 * Phase 2A: 회원 등록 + 기본 하위 데이터 자동 생성.
 */

import { collection, doc, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';
import { COLLECTIONS, SUBCOLLECTIONS } from './collections';

interface AddMemberData {
  name: string;
  group: string;
  room: string;
  age: number;
  status: string;
  todayBlendName: string;
  todayBlendId: string;
  todayFocus: string;
  note: string;
  facilityId: string;
  lastCheckTime: string;
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
  batch.set(memberRef, data);

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
