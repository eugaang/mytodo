# Implementation Plan: Google Calendar Sync

**Branch**: `004-gcal-sync` | **Date**: 2026-01-30 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-gcal-sync/spec.md`

## Summary

Google Calendar 일정을 Todo 앱에 가져오는 기능 구현. Google OAuth 2.0으로 인증 후, 오늘부터 7일간의 캘린더 일정을 조회하여 Todo로 변환. 중복 판단(date + content + time)을 통해 이미 존재하는 일정은 건너뛴다.

## Technical Context

**Language/Version**: TypeScript 5.9.3
**Primary Dependencies**: React 19.2.0, Vite 7.2.4, Express 5.2.1, @supabase/supabase-js 2.39.0
**Storage**: Supabase (PostgreSQL)
**Testing**: Manual testing (기존 프로젝트 방식 유지)
**Target Platform**: Web (PWA), Vercel Serverless Functions
**Project Type**: Web application (frontend + backend)
**Performance Goals**: 100개 이하 일정 10초 이내 가져오기
**Constraints**: HTTPS 필수 (OAuth 요구사항), 오프라인 미지원 (동기화 기능)
**Scale/Scope**: 단일 사용자 환경

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| **I. Simplicity First** | ✅ PASS | OAuth는 필수 복잡도. 최소한의 구현으로 진행 |
| **II. Type Safety** | ✅ PASS | 모든 API 응답과 Google Calendar 데이터에 인터페이스 정의 |
| **III. Clear Separation** | ✅ PASS | Frontend: UI/상태, Backend: OAuth 토큰 관리 및 Calendar API 호출 |
| **IV. Incremental Progress** | ✅ PASS | OAuth 연결 → 일정 가져오기 → 중복 체크 순차 구현 |

## Project Structure

### Documentation (this feature)

```text
specs/004-gcal-sync/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── calendar-api.yaml
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/
│   │   └── todo.ts            # 기존
│   ├── services/
│   │   └── todoService.ts     # 기존
│   └── api/
│       └── todoRoutes.ts      # 기존

frontend/
├── src/
│   ├── components/
│   │   ├── CalendarPopup.tsx      # 기존
│   │   ├── GoogleCalendarButton.tsx  # 신규: 연결/가져오기 버튼
│   │   └── ...
│   ├── services/
│   │   ├── api.ts                 # 기존
│   │   └── googleCalendar.ts      # 신규: Calendar API 클라이언트
│   └── types/
│       ├── todo.ts                # 기존
│       └── calendar.ts            # 신규: Calendar 관련 타입

api/
├── lib/
│   ├── supabase.ts            # 기존
│   └── google.ts              # 신규: Google OAuth 헬퍼
└── calendar/
    ├── connect.ts             # 신규: OAuth 시작
    ├── callback.ts            # 신규: OAuth 콜백
    ├── sync.ts                # 신규: 일정 가져오기
    ├── disconnect.ts          # 신규: 연결 해제
    └── status.ts              # 신규: 연결 상태 확인
```

**Structure Decision**: 기존 Web application 구조 유지. api/ 폴더에 calendar/ 서브디렉토리 추가하여 Vercel Serverless Functions로 구현.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Google OAuth 2.0 | Google Calendar API 접근에 필수 | 대안 없음 (Google API 정책) |
| Refresh Token 관리 | Access Token 만료 시 재로그인 방지 | UX 저하 (매번 로그인 필요) |
