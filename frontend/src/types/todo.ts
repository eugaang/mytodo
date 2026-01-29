// T004: Frontend Todo 타입 정의 (v2.0)

export type Category = 'work' | 'personal';

export interface Todo {
  id: string;
  content: string;
  completed: boolean;
  category: Category;
  date: string; // YYYY-MM-DD
  time?: string | null; // HH:MM (optional)
  created_at: string;
}

// T011: 카테고리 상수
export const CATEGORY_LABELS: Record<Category, string> = {
  work: '회사',
  personal: '개인',
};

export const CATEGORY_COLORS: Record<Category, string> = {
  work: '#3b82f6',
  personal: '#10b981',
};

// 복사 응답 타입
export interface CopyResponse {
  copiedCount: number;
  targetDate: string;
  copiedTodos: Todo[];
}
