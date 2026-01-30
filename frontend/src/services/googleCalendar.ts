import type { CalendarConnectionStatus, SyncResult } from '../types/calendar';

const API_BASE = '/api';

export async function getConnectionStatus(): Promise<CalendarConnectionStatus> {
  try {
    const response = await fetch(`${API_BASE}/calendar/status`);
    if (!response.ok) {
      return { connected: false, email: null };
    }
    return response.json();
  } catch {
    return { connected: false, email: null };
  }
}

export function connectGoogleCalendar(): void {
  window.location.href = `${API_BASE}/calendar/connect`;
}

export async function syncCalendar(category: 'work' | 'personal' = 'personal'): Promise<SyncResult> {
  try {
    const response = await fetch(`${API_BASE}/calendar/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category }),
    });
    if (!response.ok) {
      const error = await response.json();
      if (response.status === 401) {
        throw new Error('Google 캘린더 연결이 만료되었습니다. 다시 연결해주세요.');
      }
      throw new Error(error.message || '동기화에 실패했습니다');
    }
    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('네트워크 연결을 확인해주세요');
    }
    throw error;
  }
}

export async function disconnectCalendar(): Promise<void> {
  const response = await fetch(`${API_BASE}/calendar/disconnect`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Failed to disconnect');
  }
}

// LocalStorage helpers for import settings
const CATEGORY_KEY = 'gcal_default_category';

export function getDefaultCategory(): 'work' | 'personal' {
  const stored = localStorage.getItem(CATEGORY_KEY);
  return stored === 'work' ? 'work' : 'personal';
}

export function setDefaultCategory(category: 'work' | 'personal'): void {
  localStorage.setItem(CATEGORY_KEY, category);
}
