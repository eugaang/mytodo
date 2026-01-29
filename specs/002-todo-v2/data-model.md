# Data Model: TODO App 2.0

**Date**: 2026-01-29
**Source**: [spec.md](./spec.md) Key Entities 섹션
**Base**: TODO App 1.0 data-model.md

## Entities

### Todo (v2)

날짜별 관리와 카테고리 분류가 추가된 할 일 항목.

```typescript
type Category = 'work' | 'personal';

interface Todo {
  id: string;          // 고유 식별자 (UUID)
  content: string;     // 할 일 내용 (1자 이상, 공백만 불가)
  completed: boolean;  // 완료 여부
  category: Category;  // 카테고리 (회사/개인)
  date: string;        // 날짜 (YYYY-MM-DD)
  createdAt: string;   // 생성 시간 (ISO 8601)
}
```

| 필드 | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| id | string | ✅ | - | UUID v4 형식 |
| content | string | ✅ | - | 최소 1자, trim 후 빈 문자열 불가 |
| completed | boolean | ✅ | false | 완료 상태 |
| category | Category | ✅ | 'personal' | 'work' 또는 'personal' |
| date | string | ✅ | (오늘) | YYYY-MM-DD 형식 |
| createdAt | string | ✅ | - | ISO 8601 형식 |

### Changes from v1

| 필드 | v1 | v2 | 변경 사항 |
|------|----|----|-----------|
| category | ❌ | ✅ | 신규 추가 |
| date | ❌ | ✅ | 신규 추가 |

## Category Type

```typescript
type Category = 'work' | 'personal';

// 한글 표시용 매핑
const CATEGORY_LABELS: Record<Category, string> = {
  work: '회사',
  personal: '개인',
};

// 색상 매핑 (UI용)
const CATEGORY_COLORS: Record<Category, string> = {
  work: '#3b82f6',    // 파란색
  personal: '#10b981', // 초록색
};
```

## Validation Rules

### Content 검증 (FR-009)

```typescript
function isValidContent(content: string): boolean {
  return content.trim().length > 0;
}
```

### Date 검증

```typescript
function isValidDate(date: string): boolean {
  // YYYY-MM-DD 형식 검증
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(date)) return false;

  // 실제 유효한 날짜인지 검증
  const parsed = new Date(date);
  return !isNaN(parsed.getTime());
}
```

### Category 검증

```typescript
function isValidCategory(category: string): category is Category {
  return category === 'work' || category === 'personal';
}
```

## State Transitions

```
[미완료] ←→ [완료]        (Done 버튼으로 토글)
   ↓
[삭제됨]                  (삭제 버튼)

[날짜 A] → [날짜 B]       (복사, 원본 유지)
```

| 현재 상태 | 동작 | 결과 |
|-----------|------|------|
| 미완료 | Done 클릭 | 완료 (취소선) |
| 완료 | Done 클릭 | 미완료 |
| 미완료/완료 | 삭제 | 제거됨 |
| 미완료 (날짜 A) | 내일로 복사 | 날짜 B에 복사본 생성, 원본 유지 |

## Storage Format

`data/todos.json` 파일 구조:

```json
{
  "todos": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "content": "주간 보고서 작성",
      "completed": false,
      "category": "work",
      "date": "2026-01-29",
      "createdAt": "2026-01-29T10:30:00.000Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "content": "운동하기",
      "completed": true,
      "category": "personal",
      "date": "2026-01-29",
      "createdAt": "2026-01-29T08:00:00.000Z"
    }
  ]
}
```

## Migration (v1 → v2)

```typescript
interface TodoV1 {
  id: string;
  content: string;
  completed: boolean;
  createdAt: string;
}

function migrateToV2(todoV1: TodoV1): Todo {
  return {
    ...todoV1,
    category: 'personal',  // 기본값
    date: todoV1.createdAt.split('T')[0],  // createdAt에서 날짜 추출
  };
}
```

## Query Patterns

### 날짜별 조회

```typescript
function getTodosByDate(todos: Todo[], date: string): Todo[] {
  return todos.filter(todo => todo.date === date);
}
```

### 미완료 항목만 조회 (복사용)

```typescript
function getIncompleteTodos(todos: Todo[], date: string): Todo[] {
  return todos.filter(todo => todo.date === date && !todo.completed);
}
```

### 다음 날짜로 복사

```typescript
function copyToNextDate(todo: Todo): Todo {
  const nextDate = new Date(todo.date);
  nextDate.setDate(nextDate.getDate() + 1);

  return {
    ...todo,
    id: generateUUID(),  // 새 ID 생성
    date: formatDate(nextDate),  // YYYY-MM-DD
    completed: false,  // 복사본은 미완료로
    createdAt: new Date().toISOString(),
  };
}
```
