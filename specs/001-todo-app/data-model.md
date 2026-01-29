# Data Model: TODO App

**Date**: 2026-01-28
**Source**: [spec.md](./spec.md) Key Entities 섹션

## Entities

### Todo

할 일 항목을 나타내는 핵심 엔티티.

```typescript
interface Todo {
  id: string;          // 고유 식별자 (UUID)
  content: string;     // 할 일 내용 (1자 이상, 공백만 불가)
  completed: boolean;  // 완료 여부
  createdAt: string;   // 생성 시간 (ISO 8601)
}
```

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| id | string | ✅ | UUID v4 형식 |
| content | string | ✅ | 최소 1자, trim 후 빈 문자열 불가 |
| completed | boolean | ✅ | 기본값 false |
| createdAt | string | ✅ | ISO 8601 형식 |

## Validation Rules

### Content 검증 (FR-007)

```typescript
function isValidContent(content: string): boolean {
  return content.trim().length > 0;
}
```

- 빈 문자열 거부
- 공백만으로 구성된 문자열 거부
- trim 후 검증

## State Transitions

```
[미완료] ←→ [완료]
   ↓
[삭제됨]
```

| 현재 상태 | 가능한 동작 | 결과 상태 |
|-----------|-------------|-----------|
| 미완료 | 완료 토글 | 완료 |
| 완료 | 완료 토글 | 미완료 |
| 미완료/완료 | 삭제 | (제거됨) |

## Storage Format

`data/todos.json` 파일 구조:

```json
{
  "todos": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "content": "우유 사기",
      "completed": false,
      "createdAt": "2026-01-28T10:30:00.000Z"
    }
  ]
}
```
