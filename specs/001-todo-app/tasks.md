# Tasks: TODO App

**Input**: Design documents from `/specs/001-todo-app/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: 수동 테스트 (학습 목적으로 최소화)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)

## Path Conventions

- **Backend**: `backend/src/`
- **Frontend**: `frontend/src/`

---

## Phase 1: Setup

**Purpose**: 프로젝트 초기화 및 기본 구조 생성

- [x] T001 [P] Backend 프로젝트 초기화 in backend/
- [x] T002 [P] Frontend 프로젝트 생성 (Vite + React + TypeScript) in frontend/

---

## Phase 2: Foundational

**Purpose**: 모든 User Story에서 사용할 공통 인프라

**⚠️ CRITICAL**: User Story 작업 전에 완료 필수

- [x] T003 Todo 타입 정의 in backend/src/models/todo.ts
- [x] T004 [P] Frontend Todo 타입 정의 in frontend/src/types/todo.ts
- [x] T005 Express 서버 기본 설정 (CORS, JSON 파싱) in backend/src/index.ts
- [x] T006 데이터 저장소 초기화 (빈 todos.json) in backend/data/todos.json
- [x] T007 API 서비스 기본 구조 in frontend/src/services/api.ts

**Checkpoint**: Foundation 완료 - User Story 구현 시작 가능

---

## Phase 3: User Story 1 - TODO 추가 (Priority: P1) 🎯 MVP

**Goal**: 사용자가 할 일을 입력하고 목록에 추가할 수 있다

**Independent Test**: 텍스트 입력 → 추가 버튼 클릭 → 목록에 표시 확인

### Implementation

- [x] T008 [US1] TodoService - create 함수 구현 in backend/src/services/todoService.ts
- [x] T009 [US1] TodoService - getAll 함수 구현 in backend/src/services/todoService.ts
- [x] T010 [US1] POST /api/todos 엔드포인트 in backend/src/api/todoRoutes.ts
- [x] T011 [US1] GET /api/todos 엔드포인트 in backend/src/api/todoRoutes.ts
- [x] T012 [US1] 빈 문자열 검증 로직 (FR-007) in backend/src/services/todoService.ts
- [x] T013 [P] [US1] TodoInput 컴포넌트 in frontend/src/components/TodoInput.tsx
- [x] T014 [P] [US1] TodoList 컴포넌트 in frontend/src/components/TodoList.tsx
- [x] T015 [P] [US1] TodoItem 컴포넌트 (기본) in frontend/src/components/TodoItem.tsx
- [x] T016 [US1] App.tsx에서 컴포넌트 조합 및 API 연동 in frontend/src/App.tsx

**Checkpoint**: TODO 추가 기능 동작 확인 - MVP 완성

---

## Phase 4: User Story 2 - 완료 표시 (Priority: P1)

**Goal**: 사용자가 완료한 할 일을 체크하여 상태를 토글할 수 있다

**Independent Test**: 항목 클릭 → 완료 상태로 변경 (취소선) → 다시 클릭 → 미완료로 복귀

### Implementation

- [x] T017 [US2] TodoService - toggle 함수 구현 in backend/src/services/todoService.ts
- [x] T018 [US2] PATCH /api/todos/:id 엔드포인트 in backend/src/api/todoRoutes.ts
- [x] T019 [US2] TodoItem에 체크박스 및 토글 기능 추가 in frontend/src/components/TodoItem.tsx
- [x] T020 [US2] 완료 항목 스타일링 (취소선) in frontend/src/components/TodoItem.tsx

**Checkpoint**: 완료 토글 기능 동작 확인

---

## Phase 5: User Story 3 - 삭제 (Priority: P2)

**Goal**: 사용자가 필요 없는 할 일을 목록에서 삭제할 수 있다

**Independent Test**: 삭제 버튼 클릭 → 목록에서 제거 → 새로고침 후에도 삭제 유지

### Implementation

- [x] T021 [US3] TodoService - delete 함수 구현 in backend/src/services/todoService.ts
- [x] T022 [US3] DELETE /api/todos/:id 엔드포인트 in backend/src/api/todoRoutes.ts
- [x] T023 [US3] TodoItem에 삭제 버튼 추가 in frontend/src/components/TodoItem.tsx

**Checkpoint**: 삭제 기능 동작 확인 - 전체 기능 완성

---

## Phase 6: Polish

**Purpose**: 마무리 및 품질 개선

- [x] T024 [P] 기본 CSS 스타일링 in frontend/src/App.css
- [x] T025 에러 처리 및 로딩 상태 추가 in frontend/src/App.tsx
- [ ] T026 quickstart.md 검증 - 실행 가이드대로 동작 확인

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup) → Phase 2 (Foundational) → Phase 3-5 (User Stories) → Phase 6 (Polish)
```

### User Story Dependencies

| Story | Depends On | Can Parallel With |
|-------|------------|-------------------|
| US1 (추가) | Phase 2 완료 | - |
| US2 (완료) | Phase 2 완료 | US1 (독립 구현 가능) |
| US3 (삭제) | Phase 2 완료 | US1, US2 (독립 구현 가능) |

### Parallel Opportunities

**Phase 1:**
- T001, T002 병렬 실행 가능 (Backend, Frontend 독립)

**Phase 2:**
- T003, T004 병렬 실행 가능 (같은 타입 정의, 다른 프로젝트)

**Phase 3 (US1):**
- T013, T014, T015 병렬 실행 가능 (독립적인 컴포넌트)

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1: Setup 완료
2. Phase 2: Foundational 완료
3. Phase 3: US1 (추가) 완료
4. **STOP**: TODO 추가만으로 동작하는 MVP 확인
5. 필요시 여기서 배포/데모 가능

### Full Implementation

1. MVP 완료 후
2. Phase 4: US2 (완료 표시) 추가
3. Phase 5: US3 (삭제) 추가
4. Phase 6: Polish

---

## Summary

| Phase | Tasks | 설명 |
|-------|-------|------|
| Setup | 2 | 프로젝트 초기화 |
| Foundational | 5 | 공통 인프라 |
| US1 (추가) | 9 | MVP 핵심 기능 |
| US2 (완료) | 4 | 상태 토글 |
| US3 (삭제) | 3 | 항목 제거 |
| Polish | 3 | 마무리 |
| **Total** | **26** | |
