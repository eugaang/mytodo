# Feature Specification: Google Calendar Sync

**Feature Branch**: `004-gcal-sync`
**Created**: 2026-01-30
**Status**: Draft
**Input**: User description: "Google Calendar에서 일정을 가져와 자동으로 Todo로 변환하는 기능. 사용자가 Google 계정으로 로그인하면 선택한 날짜의 캘린더 일정을 Todo 리스트에 자동으로 추가한다."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Google 계정 연결 (Priority: P1)

사용자가 Google 계정으로 로그인하여 캘린더 접근 권한을 부여한다. 이를 통해 앱이 사용자의 Google Calendar 일정에 접근할 수 있게 된다.

**Why this priority**: 캘린더 연동의 전제 조건. 이 기능 없이는 일정 가져오기가 불가능하다.

**Independent Test**: "Google 로그인" 버튼을 클릭하고 Google 인증 완료 후 연결 상태가 표시되는지 확인

**Acceptance Scenarios**:

1. **Given** 사용자가 앱에 접속해 있고 Google 계정이 연결되지 않은 상태, **When** "Google 캘린더 연결" 버튼을 클릭, **Then** Google 로그인 화면으로 이동하고 캘린더 읽기 권한 요청이 표시됨
2. **Given** Google 로그인 화면에서 권한 승인 완료, **When** 앱으로 돌아옴, **Then** Google 계정 연결 상태가 표시되고 사용자 이메일/프로필이 보임
3. **Given** 사용자가 권한 요청을 거부, **When** 앱으로 돌아옴, **Then** 연결 실패 메시지가 표시되고 다시 연결 시도 가능

---

### User Story 2 - 캘린더 일정 가져오기 (Priority: P1)

사용자가 "구글 캘린더 가져오기" 버튼을 클릭하면 오늘부터 1주일간의 Google Calendar 일정을 Todo 리스트에 추가한다.

**Why this priority**: 핵심 기능. 사용자가 원하는 주요 가치를 제공한다.

**Independent Test**: "구글 캘린더 가져오기" 버튼 클릭 시 향후 1주일 일정이 Todo로 추가되는지 확인

**Acceptance Scenarios**:

1. **Given** Google 계정이 연결된 상태, **When** "구글 캘린더 가져오기" 버튼을 클릭, **Then** 오늘부터 7일간의 Google Calendar 일정이 각 날짜별 Todo 리스트에 추가됨
2. **Given** 캘린더 일정에 시간이 포함된 경우, **When** Todo로 변환됨, **Then** 일정의 시작 시간이 Todo의 time 필드에 자동으로 설정됨
3. **Given** 종일 일정(all-day event)인 경우, **When** Todo로 변환됨, **Then** 시간(time) 없이 해당 날짜의 Todo로 추가됨
4. **Given** 1주일간 캘린더 일정이 없는 경우, **When** "구글 캘린더 가져오기" 클릭, **Then** "가져올 일정이 없습니다" 메시지 표시
5. **Given** 이미 동일한 일정이 Todo로 존재하는 경우, **When** 다시 가져오기 시도, **Then** 중복 일정은 추가하지 않고 새 일정만 추가됨

**중복 판단 기준**:
- "동일한 일정"이란 **같은 날짜에 content(내용)와 time(시간)이 모두 일치**하는 Todo를 의미함
- 예: 2026-01-30에 "팀 미팅" 09:00 일정이 이미 Todo로 존재하면, 같은 내용의 캘린더 일정은 추가하지 않음
- 시간이 다르면 별개의 일정으로 처리함 (예: "팀 미팅" 09:00 vs "팀 미팅" 14:00은 서로 다른 일정)

---

### User Story 3 - 연결 해제 (Priority: P2)

사용자가 Google 계정 연결을 해제하여 캘린더 동기화를 중단할 수 있다.

**Why this priority**: 프라이버시와 계정 관리를 위한 필수 기능이나 핵심 플로우는 아님

**Independent Test**: 연결 해제 버튼 클릭 후 Google 계정 연결 상태가 해제되고 가져오기 기능이 비활성화되는지 확인

**Acceptance Scenarios**:

1. **Given** Google 계정이 연결된 상태, **When** "연결 해제" 버튼을 클릭, **Then** 확인 다이얼로그가 표시됨
2. **Given** 확인 다이얼로그에서 "해제" 선택, **When** 해제가 완료됨, **Then** Google 연결 상태가 사라지고 "캘린더에서 가져오기" 버튼이 비활성화됨
3. **Given** 연결 해제 후, **When** 다시 연결하려면, **Then** 새로 Google 로그인이 필요함

---

### User Story 4 - 가져온 일정 카테고리 지정 (Priority: P3)

사용자가 캘린더에서 가져온 일정의 기본 카테고리(work/personal)를 설정할 수 있다.

**Why this priority**: 편의 기능으로 핵심 플로우 완성 후 추가

**Independent Test**: 설정에서 기본 카테고리를 변경한 후 일정 가져오기 시 해당 카테고리가 적용되는지 확인

**Acceptance Scenarios**:

1. **Given** Google 계정이 연결된 상태, **When** 설정에서 기본 가져오기 카테고리를 "work"로 설정, **Then** 이후 가져오는 모든 일정이 "work" 카테고리로 추가됨
2. **Given** 기본 카테고리가 설정되지 않은 경우, **When** 일정을 가져옴, **Then** "personal" 카테고리로 기본 추가됨

---

### Edge Cases

- 네트워크 연결이 끊긴 상태에서 가져오기 시도 시 오류 메시지 표시 및 재시도 안내
- Google 계정 토큰이 만료된 경우 자동 갱신 시도, 실패 시 재로그인 요청
- 1주일간 100개 이상의 캘린더 일정이 있는 경우에도 모두 가져옴
- 반복 일정의 경우 1주일 범위 내의 각 인스턴스를 개별 Todo로 가져옴
- 여러 캘린더에 동일한 일정이 있는 경우 중복 판단 기준에 따라 하나만 추가됨

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 시스템은 Google OAuth 2.0을 통해 사용자 인증 및 캘린더 읽기 권한을 획득할 수 있어야 한다
- **FR-002**: 시스템은 오늘부터 7일간의 Google Calendar 일정을 조회할 수 있어야 한다
- **FR-003**: 시스템은 캘린더 일정을 Todo 형식으로 변환하여 각 날짜별로 저장할 수 있어야 한다
- **FR-004**: 시스템은 일정의 제목을 Todo content로, 시작 시간을 Todo time으로 매핑해야 한다
- **FR-005**: 시스템은 종일 일정(all-day event)의 경우 time 없이 Todo로 변환해야 한다
- **FR-006**: 시스템은 동일한 일정의 중복 추가를 방지해야 한다 (중복 기준: 같은 날짜에 content와 time이 모두 일치)
- **FR-007**: 사용자는 Google 계정 연결을 해제할 수 있어야 한다
- **FR-008**: 시스템은 인증 토큰을 안전하게 저장하고 관리해야 한다
- **FR-009**: 시스템은 토큰 만료 시 자동으로 갱신을 시도해야 한다
- **FR-010**: 사용자는 가져온 일정의 기본 카테고리를 설정할 수 있어야 한다
- **FR-011**: 시스템은 가져오기 작업 중 로딩 상태를 표시해야 한다
- **FR-012**: 시스템은 가져오기 완료 후 추가된 일정 개수를 알려야 한다

### Key Entities

- **CalendarConnection**: 사용자의 Google 계정 연결 상태 (연결 여부, 사용자 이메일, 토큰 정보)
- **CalendarEvent**: Google Calendar에서 가져온 원본 일정 정보 (이벤트 ID, 제목, 시작/종료 시간)
- **ImportedTodo**: 캘린더에서 변환된 Todo (기존 Todo 필드 + 원본 캘린더 이벤트 ID 참조)
- **ImportSettings**: 가져오기 관련 사용자 설정 (기본 카테고리)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 사용자가 Google 계정 연결부터 첫 일정 가져오기까지 2분 이내에 완료할 수 있다
- **SC-002**: 1주일간 100개 이하의 캘린더 일정을 10초 이내에 가져와 Todo로 변환할 수 있다
- **SC-003**: 사용자가 가져오기 버튼 클릭 후 로딩 상태를 즉시 확인할 수 있다
- **SC-004**: 95% 이상의 가져오기 시도가 성공적으로 완료된다 (네트워크 오류 제외)
- **SC-005**: content와 time이 일치하는 중복 일정은 100% 걸러진다

## Assumptions

- 사용자는 이미 Google 계정을 보유하고 있다
- 사용자의 Google Calendar에 일정이 존재한다
- 앱은 HTTPS 환경에서 실행된다 (OAuth 요구사항)
- 현재 앱에 인증 시스템이 없으므로, 단일 사용자 환경으로 가정한다
- 가져오기는 "구글 캘린더 가져오기" 버튼 클릭을 통한 수동 트리거 방식으로, 자동 동기화는 포함하지 않는다
- 가져오기 범위는 오늘부터 7일간으로 고정되며, 사용자가 변경할 수 없다
- 중복 판단은 같은 날짜 내에서 content와 time의 일치 여부로 결정한다
