# Release Notes

## v5.0.0 (2026-02-02)

### New Features

#### 메모 기능
- 각 일정에 메모 추가 가능
- 우클릭 메뉴에서 "메모 추가" 선택
- 메모가 있는 항목에만 📝 아이콘 표시
- 아이콘 클릭 시 메모 내용 확인/수정/삭제

#### 일정 수정 기능
- PC: 일정 더블클릭으로 수정 모달 열기
- 모바일: 일정 탭으로 수정 바텀시트 열기
- 내용, 시간, 카테고리, 메모 일괄 수정
- 수정 화면 하단 좌측에 삭제 버튼 추가

#### PC 전용 기능
- 우클릭 컨텍스트 메뉴 (수정/메모/날짜이동/삭제)
- 메모 아이콘 호버 시 팝오버로 내용 표시
- 컨텍스트 메뉴 화면 경계 자동 조정

#### 모바일 전용 기능
- 바텀시트 UI로 수정/메모 편집

#### 단일 항목 날짜 이동
- 개별 일정을 다음 7일 중 원하는 날짜로 이동

### UI/UX 개선
- 앱 이름 "MyTodo"로 변경
- PC/모바일 자동 감지 및 최적화된 UX 제공
- Safari "Dock에 추가" 지원 (PWA)

### Technical Changes
- Supabase todos 테이블에 memo 컬럼 추가
- useDeviceType 커스텀 훅 추가
- Popover, BottomSheet, ContextMenu 공통 컴포넌트 추가
- API: updateTodo, updateMemo, moveSingleTodo 함수 추가
- PWA manifest 및 메타태그 개선

---

## v4.0.0 (2025-01-30)

### New Features

#### Google Calendar 연동
- Google OAuth 2.0을 통한 캘린더 연결
- 오늘부터 1주일 간의 일정을 자동으로 가져오기
- 중복 일정 자동 건너뛰기 (날짜 + 내용 + 시간 기준)
- 종일 일정은 시간 없이 가져오기

#### 자동 카테고리 분류
- 캘린더 이름 기반 자동 분류
- Work 키워드: work, business, 업무, 회사, 직장, 미팅, meeting, office
- 그 외 캘린더는 '개인'으로 분류

#### 수동 카테고리 변경
- 각 항목의 W/P 배지 클릭으로 카테고리 전환
- 자동 분류 후 수동 조정 가능

#### 미완료 항목 이동
- 기존: 미완료 항목을 내일로 복사
- 변경: 다음 7일 중 원하는 날짜로 이동 (원본 삭제)
- 연휴 등 특정 날짜로 직접 이동 가능

### Bug Fixes
- 타임존 이슈 수정: 캘린더 일정이 잘못된 날짜로 저장되던 문제 해결

### Technical Changes
- Google Calendar API 통합
- Supabase에 calendar_connections 테이블 추가
- googleapis 패키지 추가
- API 엔드포인트: /api/calendar/connect, callback, status, disconnect, sync
- copy-to-next-day → move-to-date API 변경

---

## v3.0.0

- 달력 팝업 UI
- 카테고리 섹션 분리 (회사/개인)
- 시간 입력 및 시간순 정렬

## v2.0.0

- 날짜별 TODO 관리
- 카테고리 (회사/개인)
- Done 버튼
- 내일로 복사 기능

## v1.0.0

- 기본 TODO CRUD
