// T003: Todo 타입 정의 (v2.0 - category, date 추가)

export type Category = 'work' | 'personal';

export interface Todo {
  id: string;
  content: string;
  completed: boolean;
  category: Category;
  date: string; // YYYY-MM-DD
  createdAt: string;
}

export interface CreateTodoRequest {
  content: string;
  category?: Category;
  date?: string;
}

// v1 타입 (마이그레이션용)
export interface TodoV1 {
  id: string;
  content: string;
  completed: boolean;
  createdAt: string;
}
