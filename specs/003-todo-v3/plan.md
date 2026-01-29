# TODO App 3.0 Implementation Plan

## Architecture Overview

기존 TODO 2.0 아키텍처를 유지하면서 프론트엔드 UI 개선과 데이터 모델 확장에 집중한다.

```
Frontend (React + Vite)
├── components/
│   ├── DatePicker.tsx      # 수정: 달력 팝업 추가
│   ├── CalendarPopup.tsx   # 신규: 달력 컴포넌트
│   ├── TodoInput.tsx       # 수정: 시간 입력 추가
│   ├── TodoItem.tsx        # 수정: 시간 배지 표시
│   ├── TodoSection.tsx     # 신규: 카테고리 섹션
│   └── TodoList.tsx        # 수정: 섹션 기반 렌더링
└── App.tsx                 # 수정: 정렬 로직

Backend (Vercel Serverless + Supabase)
└── api/todos/              # 수정: time 필드 지원
```

## Phase 1: Database Schema Update

### Supabase Migration
```sql
ALTER TABLE todos ADD COLUMN time TEXT;
```

### API Updates
- POST /api/todos: time 필드 처리
- PUT /api/todos/:id: time 필드 수정 지원

## Phase 2: Calendar Popup (F1)

### CalendarPopup.tsx
- 월 단위 달력 그리드 표시
- 이전/다음 월 이동
- 날짜 클릭 시 onSelect 콜백
- 오늘 날짜 하이라이트
- 선택된 날짜 하이라이트

### DatePicker.tsx 수정
- 날짜 텍스트에 onClick 핸들러 추가
- CalendarPopup 조건부 렌더링
- 외부 클릭 감지로 팝업 닫기

## Phase 3: Category Sections (F2, F3)

### TodoSection.tsx
- 섹션 헤더 (회사/개인)
- 해당 카테고리 할일 목록 렌더링
- 빈 섹션은 렌더링하지 않음

### TodoList.tsx 수정
- 카테고리별 필터링
- 회사 섹션 → 개인 섹션 순서로 렌더링

## Phase 4: Time Feature (F4)

### TodoInput.tsx 수정
- 시간 입력 필드 추가 (type="time")
- 시간 상태 관리
- createTodo 호출 시 time 전달

### TodoItem.tsx 수정
- 시간이 있는 경우 시간 배지 표시
- 배지 스타일링

### 정렬 로직 (App.tsx)
```typescript
const sortTodos = (todos: Todo[]) => {
  return todos.sort((a, b) => {
    // 1. 완료 항목 우선
    if (a.completed !== b.completed) {
      return a.completed ? -1 : 1;
    }
    // 2. 시간 있는 항목 우선
    if ((a.time !== undefined) !== (b.time !== undefined)) {
      return a.time ? -1 : 1;
    }
    // 3. 시간순 정렬
    if (a.time && b.time) {
      return a.time.localeCompare(b.time);
    }
    // 4. 생성 순서
    return a.createdAt.localeCompare(b.createdAt);
  });
};
```

## Phase 5: Done Animation (F5)

### 완료 시 동작
1. toggleTodo 호출
2. 상태 업데이트 후 정렬 함수 적용
3. 자연스럽게 상단으로 이동 (정렬 로직에 의해)

### CSS 트랜지션 (선택사항)
- 위치 변경 시 부드러운 애니메이션

## File Changes Summary

| 파일 | 변경 유형 | 설명 |
|------|----------|------|
| api/todos/index.ts | 수정 | time 필드 처리 |
| api/todos/[id].ts | 수정 | time 필드 업데이트 |
| frontend/src/types/todo.ts | 수정 | time 필드 추가 |
| frontend/src/services/api.ts | 수정 | time 파라미터 추가 |
| frontend/src/components/CalendarPopup.tsx | 신규 | 달력 팝업 |
| frontend/src/components/DatePicker.tsx | 수정 | 팝업 연동 |
| frontend/src/components/TodoInput.tsx | 수정 | 시간 입력 |
| frontend/src/components/TodoItem.tsx | 수정 | 시간 배지 |
| frontend/src/components/TodoSection.tsx | 신규 | 카테고리 섹션 |
| frontend/src/components/TodoList.tsx | 수정 | 섹션 기반 렌더링 |
| frontend/src/App.tsx | 수정 | 정렬 로직 |
| frontend/src/App.css | 수정 | 새 스타일 |

## Dependencies
- 추가 라이브러리 없음 (순수 React로 구현)

## Risks & Mitigations

| 리스크 | 완화 방안 |
|--------|----------|
| 달력 UI 복잡성 | 간단한 월간 그리드로 구현 |
| 정렬 성능 | 프론트엔드에서 처리, 필요시 서버 정렬 |
| 시간대 이슈 | 로컬 시간만 사용, 서버 저장은 문자열 |
