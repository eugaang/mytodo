# Feature Specification: TODO App 2.0

**Feature Branch**: `002-todo-v2`
**Created**: 2026-01-28
**Status**: Draft
**Input**: "날짜별 관리, Done 버튼, 회사/개인 분류, 다음 날짜로 복사"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 날짜별 TODO 관리 (Priority: P1)

사용자는 특정 날짜를 선택하여 해당 날짜의 할 일 목록을 관리할 수 있다. 날짜 선택기를 통해 과거/미래 날짜로 이동하며 각 날짜별로 독립적인 TODO 목록을 볼 수 있다.

**Acceptance Scenarios**:

1. **Given** 앱 첫 실행, **When** 화면 로드, **Then** 오늘 날짜가 기본 선택되어 있음
2. **Given** 오늘 날짜 선택, **When** 다른 날짜 클릭, **Then** 해당 날짜의 TODO 목록 표시
3. **Given** 특정 날짜에 TODO 추가, **When** 다른 날짜로 이동 후 돌아옴, **Then** 추가한 TODO가 유지됨

---

### User Story 2 - Done 버튼으로 완료 표시 (Priority: P1)

사용자는 할 일을 완료하면 Done 버튼을 클릭하여 완료 상태로 표시한다. 완료된 항목은 취소선이 그어지며, 삭제와는 별개로 "끝냈다"는 성취감을 준다.

**Acceptance Scenarios**:

1. **Given** 미완료 TODO 항목, **When** Done 버튼 클릭, **Then** 취소선이 그어지고 완료 상태로 변경
2. **Given** 완료된 TODO 항목, **When** Done 버튼 다시 클릭, **Then** 취소선이 사라지고 미완료 상태로 복귀
3. **Given** 완료된 TODO 항목, **When** 삭제 버튼 클릭, **Then** 목록에서 완전히 제거됨

---

### User Story 3 - 회사/개인 카테고리 분류 (Priority: P2)

사용자는 TODO를 추가할 때 회사업무 또는 개인업무 카테고리를 선택할 수 있다. 목록에서 카테고리별로 시각적으로 구분되어 표시된다.

**Acceptance Scenarios**:

1. **Given** TODO 입력 화면, **When** 새 항목 추가, **Then** 카테고리 선택 옵션 (회사/개인) 표시
2. **Given** 회사업무로 추가한 TODO, **When** 목록 확인, **Then** 회사 아이콘/색상으로 구분 표시
3. **Given** 개인업무로 추가한 TODO, **When** 목록 확인, **Then** 개인 아이콘/색상으로 구분 표시

---

### User Story 4 - 다음 날짜로 복사 (Priority: P2)

사용자는 오늘 못 끝낸 할 일을 다음 날로 복사할 수 있다. 미완료 항목만 선택적으로 또는 일괄로 복사할 수 있다.

**Acceptance Scenarios**:

1. **Given** 오늘 날짜에 미완료 TODO 존재, **When** "내일로 복사" 버튼 클릭, **Then** 미완료 항목들이 내일 날짜로 복사됨
2. **Given** 복사 실행 후, **When** 내일 날짜로 이동, **Then** 복사된 TODO 목록 확인 가능
3. **Given** 복사된 TODO, **When** 원본 날짜 확인, **Then** 원본은 그대로 유지 (이동이 아닌 복사)

---

### Edge Cases

- 미래 날짜에 TODO를 추가할 수 있는가? → 허용 (계획 용도)
- 과거 날짜에 TODO를 추가할 수 있는가? → 허용 (기록 용도)
- 모든 항목이 완료된 상태에서 복사하면? → 복사할 항목 없음 알림
- 카테고리 미선택 시? → 기본값 "개인" 적용

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 시스템은 날짜별로 독립적인 TODO 목록을 관리해야 한다
- **FR-002**: 시스템은 날짜 선택기를 제공하여 날짜 간 이동을 지원해야 한다
- **FR-003**: 시스템은 각 TODO 항목에 Done 버튼을 제공해야 한다
- **FR-004**: 시스템은 완료된 항목을 취소선으로 표시해야 한다
- **FR-005**: 시스템은 TODO 추가 시 카테고리(회사/개인) 선택을 지원해야 한다
- **FR-006**: 시스템은 카테고리별로 시각적 구분(색상/아이콘)을 제공해야 한다
- **FR-007**: 시스템은 미완료 TODO를 다음 날짜로 복사하는 기능을 제공해야 한다
- **FR-008**: 시스템은 모든 TODO 데이터를 날짜별로 영구 저장해야 한다
- **FR-009**: 시스템은 빈 문자열 TODO 생성을 거부해야 한다 (1.0 유지)

### Key Entities

- **Todo**: 할 일 항목
  - 고유 식별자 (id)
  - 내용 (content)
  - 완료 여부 (completed)
  - 카테고리 (category: "work" | "personal")
  - 날짜 (date: YYYY-MM-DD)
  - 생성 시간 (createdAt)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 사용자는 3초 이내에 날짜를 변경하고 해당 날짜의 TODO를 볼 수 있다
- **SC-002**: 사용자는 카테고리를 한눈에 구분할 수 있다 (색상/아이콘)
- **SC-003**: 복사 기능은 1초 이내에 완료되어야 한다
- **SC-004**: 앱 재시작 후에도 모든 날짜의 데이터가 유지된다

## Assumptions

- 단일 사용자 환경 유지
- 오프라인 우선 유지
- 1.0 기능(추가, 삭제)은 그대로 유지
