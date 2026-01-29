// T007: API 서비스 기본 구조 (v2.0)
// T012-T014: 날짜별 조회, 카테고리, 복사 API

import type { Todo, Category, CopyResponse } from '../types/todo';

// 프로덕션에서는 같은 도메인의 /api 사용
const API_BASE = import.meta.env.PROD ? '/api' : 'http://localhost:3000/api';

// T012: 날짜별 TODO 조회
export async function getTodos(date: string): Promise<Todo[]> {
  const res = await fetch(`${API_BASE}/todos?date=${date}`);
  if (!res.ok) throw new Error('Failed to fetch todos');
  return res.json();
}

// T013: TODO 생성 (카테고리, 날짜, 시간 지원)
export async function createTodo(
  content: string,
  category: Category = 'personal',
  date: string,
  time?: string
): Promise<Todo> {
  const body: any = { content, category, date };
  if (time) body.time = time;

  const res = await fetch(`${API_BASE}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Failed to create todo');
  return res.json();
}

export async function toggleTodo(id: string, completed: boolean): Promise<Todo> {
  const res = await fetch(`${API_BASE}/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed }),
  });
  if (!res.ok) throw new Error('Failed to toggle todo');
  return res.json();
}

export async function deleteTodo(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/todos/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete todo');
}

// T014: 미완료 항목 다음 날짜로 복사
export async function copyToNextDay(sourceDate: string): Promise<CopyResponse> {
  const res = await fetch(`${API_BASE}/todos/copy-to-next-day`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sourceDate }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to copy todos');
  }
  return res.json();
}
