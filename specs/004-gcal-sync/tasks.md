# Tasks: Google Calendar Sync

**Input**: Design documents from `/specs/004-gcal-sync/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: Package installation and environment configuration

- [x] T001 Install googleapis package in project root: `npm install googleapis`
- [x] T002 [P] Add Google OAuth environment variables to .env.example
- [x] T003 [P] Create TypeScript types file in frontend/src/types/calendar.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Create Supabase table `calendar_connections` using SQL from data-model.md
- [x] T005 [P] Create Google OAuth helper module in api/lib/google.ts
- [x] T006 [P] Create api/calendar directory structure for serverless functions

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Google 계정 연결 (Priority: P1) 🎯 MVP

**Goal**: 사용자가 Google 계정으로 로그인하여 캘린더 접근 권한을 부여

**Independent Test**: "Google 캘린더 연결" 버튼 클릭 → Google 로그인 → 연결 상태 표시 확인

### Implementation for User Story 1

- [x] T007 [P] [US1] Implement OAuth connect endpoint in api/calendar/connect.ts
- [x] T008 [P] [US1] Implement OAuth callback endpoint in api/calendar/callback.ts
- [x] T009 [US1] Implement connection status endpoint in api/calendar/status.ts
- [x] T010 [P] [US1] Create googleCalendar service in frontend/src/services/googleCalendar.ts
- [x] T011 [US1] Create GoogleCalendarButton component in frontend/src/components/GoogleCalendarButton.tsx
- [x] T012 [US1] Integrate GoogleCalendarButton into App.tsx with connection state management
- [x] T013 [US1] Handle OAuth callback redirect and show success/error message in frontend

**Checkpoint**: User Story 1 완료 - Google 계정 연결/상태 확인 가능

---

## Phase 4: User Story 2 - 캘린더 일정 가져오기 (Priority: P1)

**Goal**: "구글 캘린더 가져오기" 버튼 클릭 시 7일간 일정을 Todo로 변환

**Independent Test**: 연결된 상태에서 가져오기 버튼 클릭 → Todo 리스트에 일정 추가 확인

**Dependencies**: User Story 1 완료 필요 (연결 상태에서만 동작)

### Implementation for User Story 2

- [x] T014 [US2] Implement sync endpoint in api/calendar/sync.ts with:
  - Google Calendar API 호출 (7일 범위)
  - 종일 일정 처리 (time 없이 변환)
  - 중복 체크 (date + content + time)
  - Todo 생성 및 결과 반환
- [x] T015 [US2] Add syncCalendar function to frontend/src/services/googleCalendar.ts
- [x] T016 [US2] Add "구글 캘린더 가져오기" button to GoogleCalendarButton component
- [x] T017 [US2] Implement loading state and result message display in frontend
- [x] T018 [US2] Refresh Todo list after successful sync in App.tsx

**Checkpoint**: User Story 2 완료 - 일정 가져오기 및 중복 방지 동작

---

## Phase 5: User Story 3 - 연결 해제 (Priority: P2)

**Goal**: 사용자가 Google 계정 연결을 해제하여 캘린더 동기화 중단

**Independent Test**: 연결 해제 버튼 클릭 → 확인 다이얼로그 → 연결 상태 초기화

**Dependencies**: User Story 1 완료 필요 (연결된 상태에서만 해제 가능)

### Implementation for User Story 3

- [x] T019 [US3] Implement disconnect endpoint in api/calendar/disconnect.ts
- [x] T020 [US3] Add disconnectCalendar function to frontend/src/services/googleCalendar.ts
- [x] T021 [US3] Add disconnect button with confirmation dialog to GoogleCalendarButton component
- [x] T022 [US3] Update App.tsx to handle disconnect and reset connection state

**Checkpoint**: User Story 3 완료 - 연결 해제 기능 동작

---

## Phase 6: User Story 4 - 가져온 일정 카테고리 지정 (Priority: P3)

**Goal**: 캘린더에서 가져온 일정의 기본 카테고리(work/personal) 설정

**Independent Test**: 설정에서 카테고리 변경 후 가져오기 → 해당 카테고리로 추가 확인

**Dependencies**: User Story 2 완료 필요 (가져오기 기능이 있어야 카테고리 적용 가능)

### Implementation for User Story 4

- [x] T023 [US4] Add localStorage helper for import settings in frontend/src/services/googleCalendar.ts
- [x] T024 [US4] Add category selector UI to GoogleCalendarButton component
- [x] T025 [US4] Pass selected category to sync API call
- [x] T026 [US4] Update api/calendar/sync.ts to use category from request body

**Checkpoint**: User Story 4 완료 - 카테고리 설정 기능 동작

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Error handling, edge cases, and refinements

- [x] T027 [P] Add network error handling with retry guidance in all API calls
- [x] T028 [P] Handle token expiry with auto-refresh in api/lib/google.ts
- [x] T029 Add user-friendly error messages for all failure scenarios
- [x] T030 Run quickstart.md validation - test full flow from connect to sync

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational - MVP, 먼저 완료
- **User Story 2 (Phase 4)**: Depends on User Story 1 (연결 필요)
- **User Story 3 (Phase 5)**: Depends on User Story 1 (연결 해제는 연결 후 가능)
- **User Story 4 (Phase 6)**: Depends on User Story 2 (가져오기 기능 필요)
- **Polish (Phase 7)**: Depends on all user stories complete

### User Story Dependencies

```
Phase 1: Setup
    ↓
Phase 2: Foundational
    ↓
Phase 3: US1 (Google 계정 연결) ← MVP
    ↓
    ├─→ Phase 4: US2 (일정 가져오기)
    │       ↓
    │   Phase 6: US4 (카테고리 지정)
    │
    └─→ Phase 5: US3 (연결 해제)
            ↓
        Phase 7: Polish
```

### Parallel Opportunities

**Phase 1 (Setup)**:
- T002, T003 can run in parallel

**Phase 2 (Foundational)**:
- T005, T006 can run in parallel after T004

**Phase 3 (US1)**:
- T007, T008 can run in parallel (different endpoints)
- T010 can run in parallel with API tasks

**Phase 7 (Polish)**:
- T027, T028 can run in parallel

---

## Parallel Example: Phase 3 (User Story 1)

```bash
# Launch API endpoints in parallel:
Task: "Implement OAuth connect endpoint in api/calendar/connect.ts"
Task: "Implement OAuth callback endpoint in api/calendar/callback.ts"

# Then frontend tasks:
Task: "Create googleCalendar service in frontend/src/services/googleCalendar.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 + 2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (연결)
4. Complete Phase 4: User Story 2 (가져오기)
5. **STOP and VALIDATE**: 연결 → 가져오기 전체 플로우 테스트
6. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. US1 (연결) → Test → 연결만 가능한 상태로 배포 가능
3. US2 (가져오기) → Test → 핵심 기능 완료, 배포 권장
4. US3 (연결 해제) → Test → 계정 관리 기능 추가
5. US4 (카테고리) → Test → 편의 기능 완료
6. Polish → Final release

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- US1과 US2는 둘 다 P1 우선순위지만, US1이 US2의 전제조건
- Manual testing 방식 유지 (자동화 테스트 미포함)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
