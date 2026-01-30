# Release Notes

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
