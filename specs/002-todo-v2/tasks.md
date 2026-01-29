# Implementation Tasks: TODO App 2.0

**Branch**: `002-todo-v2` | **Date**: 2026-01-29 | **Plan**: [plan.md](./plan.md)

## Task Legend

- `[ ]` - 미완료
- `[x]` - 완료
- `[P]` - 병렬 실행 가능
- `[B]` - 블로킹 (이전 태스크 완료 필수)

## Phase 0: Data Migration

> 기존 1.0 데이터를 2.0 형식으로 변환

| ID | Task | 파일 | 의존성 |
|----|------|------|--------|
| T001 | [ ] [B] 기존 Todo 타입에 category, date 필드 추가 | `backend/src/models/todo.ts` | - |
| T002 | [ ] [B] 마이그레이션 함수 작성 (v1→v2) | `backend/src/services/todoService.ts` | T001 |
| T003 | [ ] [B] 서버 시작 시 자동 마이그레이션 적용 | `backend/src/services/todoService.ts` | T002 |

## Phase 1: Backend - Core API Changes

> 날짜 기반 조회 및 생성 API 수정

| ID | Task | 파일 | 의존성 |
|----|------|------|--------|
| T004 | [ ] [B] getTodos에 date 쿼리 파라미터 추가 | `backend/src/api/todoRoutes.ts` | T003 |
| T005 | [ ] [B] getByDate 서비스 함수 추가 | `backend/src/services/todoService.ts` | T003 |
| T006 | [ ] [B] createTodo에 category, date 파라미터 추가 | `backend/src/api/todoRoutes.ts` | T003 |
| T007 | [ ] [B] create 서비스에서 기본값 처리 (category=personal, date=today) | `backend/src/services/todoService.ts` | T003 |

## Phase 2: Backend - Copy API

> 미완료 항목 복사 기능

| ID | Task | 파일 | 의존성 |
|----|------|------|--------|
| T008 | [ ] [B] copyToNextDay 서비스 함수 작성 | `backend/src/services/todoService.ts` | T005 |
| T009 | [ ] [B] POST /todos/copy-to-next-day 엔드포인트 추가 | `backend/src/api/todoRoutes.ts` | T008 |

## Phase 3: Frontend - Type Updates

> 프론트엔드 타입 및 API 서비스 수정

| ID | Task | 파일 | 의존성 |
|----|------|------|--------|
| T010 | [ ] [P] Todo 타입에 category, date 추가 | `frontend/src/types/todo.ts` | T001 |
| T011 | [ ] [P] Category 타입 및 상수 정의 | `frontend/src/types/todo.ts` | T010 |
| T012 | [ ] [B] getTodos API에 date 파라미터 추가 | `frontend/src/services/api.ts` | T010 |
| T013 | [ ] [B] createTodo API에 category, date 파라미터 추가 | `frontend/src/services/api.ts` | T010 |
| T014 | [ ] [B] copyToNextDay API 함수 추가 | `frontend/src/services/api.ts` | T010 |

## Phase 4: Frontend - Date Navigation

> 날짜 선택 UI 및 상태 관리

| ID | Task | 파일 | 의존성 |
|----|------|------|--------|
| T015 | [ ] [B] DatePicker 컴포넌트 생성 (이전/다음 버튼, 날짜 표시) | `frontend/src/components/DatePicker.tsx` | - |
| T016 | [ ] [B] App.tsx에 selectedDate 상태 추가 | `frontend/src/App.tsx` | T015 |
| T017 | [ ] [B] loadTodos를 날짜 기반으로 수정 | `frontend/src/App.tsx` | T012, T016 |
| T018 | [ ] [B] 날짜 변경 시 TODO 목록 새로고침 | `frontend/src/App.tsx` | T017 |

## Phase 5: Frontend - Category Feature

> 카테고리 선택 및 표시

| ID | Task | 파일 | 의존성 |
|----|------|------|--------|
| T019 | [ ] [B] TodoInput에 카테고리 선택 UI 추가 | `frontend/src/components/TodoInput.tsx` | T011 |
| T020 | [ ] [B] handleAdd에 category 전달 | `frontend/src/App.tsx` | T013, T019 |
| T021 | [ ] [B] TodoItem에 카테고리 표시 (색상/라벨) | `frontend/src/components/TodoItem.tsx` | T011 |

## Phase 6: Frontend - Done Button & Copy

> Done 버튼 스타일 및 복사 기능

| ID | Task | 파일 | 의존성 |
|----|------|------|--------|
| T022 | [ ] [B] TodoItem의 체크박스를 Done 버튼으로 변경 | `frontend/src/components/TodoItem.tsx` | - |
| T023 | [ ] [B] 완료 상태 시 취소선 스타일 적용 | `frontend/src/App.css` | T022 |
| T024 | [ ] [B] "내일로 복사" 버튼 추가 | `frontend/src/App.tsx` | T014 |
| T025 | [ ] [B] handleCopyToNextDay 핸들러 구현 | `frontend/src/App.tsx` | T024 |
| T026 | [ ] [B] 복사 결과 알림 (성공/실패) | `frontend/src/App.tsx` | T025 |

## Phase 7: Styling

> UI 스타일 마무리

| ID | Task | 파일 | 의존성 |
|----|------|------|--------|
| T027 | [ ] [P] DatePicker 스타일링 | `frontend/src/App.css` | T015 |
| T028 | [ ] [P] 카테고리별 색상 스타일 (work=파랑, personal=초록) | `frontend/src/App.css` | T021 |
| T029 | [ ] [P] 복사 버튼 스타일링 | `frontend/src/App.css` | T024 |

---

## Progress Summary

| Phase | Total | Done | Remaining |
|-------|-------|------|-----------|
| 0. Migration | 3 | 0 | 3 |
| 1. Core API | 4 | 0 | 4 |
| 2. Copy API | 2 | 0 | 2 |
| 3. Types | 5 | 0 | 5 |
| 4. Date Nav | 4 | 0 | 4 |
| 5. Category | 3 | 0 | 3 |
| 6. Done & Copy | 5 | 0 | 5 |
| 7. Styling | 3 | 0 | 3 |
| **Total** | **29** | **0** | **29** |

## Execution Order (Recommended)

```
Phase 0 (Migration)
    ↓
Phase 1 (Core API) ─┬─→ Phase 2 (Copy API)
    ↓               │
Phase 3 (Types) ────┘
    ↓
Phase 4 (Date Nav) → Phase 5 (Category) → Phase 6 (Done & Copy)
    ↓
Phase 7 (Styling) - 병렬 가능
```

## MVP Definition

**최소 동작 버전 (T001 ~ T018 완료 시)**:
- 날짜별 TODO 조회/추가 가능
- 기존 1.0 데이터 마이그레이션 완료
- 날짜 네비게이션 동작

**완전 기능 버전 (모든 Task 완료 시)**:
- 카테고리 선택 및 표시
- Done 버튼 + 취소선
- 내일로 복사 기능
