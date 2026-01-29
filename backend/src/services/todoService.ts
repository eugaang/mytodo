// T008, T009, T012: TodoService - create, getAll, validation
// v2.0: 날짜별 조회, 카테고리, 마이그레이션, 복사 기능 추가

import fs from 'fs';
import path from 'path';
import { Todo, CreateTodoRequest, Category, TodoV1 } from '../models/todo';
import { randomUUID } from 'crypto';

const DATA_PATH = path.join(__dirname, '../../data/todos.json');

interface TodoData {
  todos: Todo[];
  version?: number;
}

// 오늘 날짜를 YYYY-MM-DD 형식으로 반환
function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

// 다음 날짜를 YYYY-MM-DD 형식으로 반환
function getNextDate(date: string): string {
  const d = new Date(date);
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

function readData(): TodoData {
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  return JSON.parse(raw);
}

function writeData(data: TodoData): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

// T002: v1 → v2 마이그레이션
function migrateV1ToV2(todoV1: TodoV1): Todo {
  return {
    ...todoV1,
    category: 'personal' as Category,
    date: todoV1.createdAt.split('T')[0],
  };
}

// T003: 서버 시작 시 자동 마이그레이션
export function migrateDataIfNeeded(): void {
  const data = readData();

  // 이미 v2면 스킵
  if (data.version === 2) return;

  // v1 데이터를 v2로 변환
  const migratedTodos = data.todos.map((todo) => {
    // category 필드가 없으면 v1으로 간주
    if (!('category' in todo)) {
      return migrateV1ToV2(todo as unknown as TodoV1);
    }
    return todo;
  });

  writeData({ todos: migratedTodos, version: 2 });
  console.log(`[Migration] ${migratedTodos.length}개 TODO를 v2로 마이그레이션 완료`);
}

// T012: 빈 문자열 검증 (FR-007)
function isValidContent(content: string): boolean {
  return content.trim().length > 0;
}

// T009: getAll (전체 조회)
export function getAll(): Todo[] {
  const data = readData();
  return data.todos;
}

// T005: getByDate (날짜별 조회)
export function getByDate(date: string): Todo[] {
  const data = readData();
  return data.todos.filter((todo) => todo.date === date);
}

// T008: create (카테고리, 날짜 지원)
export function create(request: CreateTodoRequest): Todo | null {
  if (!isValidContent(request.content)) {
    return null; // 빈 문자열 거부
  }

  const data = readData();
  const newTodo: Todo = {
    id: randomUUID(),
    content: request.content.trim(),
    completed: false,
    category: request.category || 'personal',
    date: request.date || getTodayDate(),
    createdAt: new Date().toISOString(),
  };

  data.todos.push(newTodo);
  writeData(data);
  return newTodo;
}

// T008: copyToNextDay (미완료 항목 다음 날짜로 복사)
export function copyToNextDay(sourceDate: string): { copiedCount: number; targetDate: string; copiedTodos: Todo[] } {
  const data = readData();
  const incompleteTodos = data.todos.filter(
    (todo) => todo.date === sourceDate && !todo.completed
  );

  if (incompleteTodos.length === 0) {
    return { copiedCount: 0, targetDate: getNextDate(sourceDate), copiedTodos: [] };
  }

  const targetDate = getNextDate(sourceDate);
  const copiedTodos: Todo[] = incompleteTodos.map((todo) => ({
    ...todo,
    id: randomUUID(),
    date: targetDate,
    completed: false,
    createdAt: new Date().toISOString(),
  }));

  data.todos.push(...copiedTodos);
  writeData(data);

  return { copiedCount: copiedTodos.length, targetDate, copiedTodos };
}

// T017: toggle (Phase 4에서 사용)
export function toggle(id: string): Todo | null {
  const data = readData();
  const todo = data.todos.find((t) => t.id === id);
  if (!todo) return null;

  todo.completed = !todo.completed;
  writeData(data);
  return todo;
}

// T021: delete (Phase 5에서 사용)
export function remove(id: string): boolean {
  const data = readData();
  const index = data.todos.findIndex((t) => t.id === id);
  if (index === -1) return false;

  data.todos.splice(index, 1);
  writeData(data);
  return true;
}
