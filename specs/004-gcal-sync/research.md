# Research: Google Calendar Sync

**Feature**: 004-gcal-sync | **Date**: 2026-01-30

## 1. Google OAuth 2.0 for Vercel Serverless

### Decision
`googleapis` 패키지의 OAuth2Client 사용. Vercel Serverless 환경에 적합한 stateless 방식.

### Rationale
- googleapis 패키지가 토큰 자동 갱신 지원
- `tokens` 이벤트로 갱신된 토큰 감지 가능
- 별도 세션 관리 불필요

### Key Implementation

```typescript
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// OAuth URL 생성
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',      // refresh token 필수
  prompt: 'consent',           // 항상 refresh token 받기
  scope: ['https://www.googleapis.com/auth/calendar.readonly'],
});
```

### Alternatives Considered
- **NextAuth.js**: 과도한 복잡도, 현재 앱에 인증 시스템 없음
- **Passport.js**: Express 세션 기반, Serverless에 부적합

---

## 2. Google Calendar API - 일정 조회

### Decision
`calendar.events.list` API로 7일 범위 일정 조회. `singleEvents: true`로 반복 일정 확장.

### Rationale
- 단일 API 호출로 필요한 모든 일정 조회 가능
- 반복 일정 자동 확장으로 별도 처리 불필요

### Key Implementation

```typescript
const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

const response = await calendar.events.list({
  calendarId: 'primary',
  timeMin: new Date().toISOString(),           // 오늘
  timeMax: addDays(new Date(), 7).toISOString(), // 7일 후
  singleEvents: true,                           // 반복 일정 확장
  orderBy: 'startTime',
  maxResults: 250,
});
```

### Event → Todo 매핑

| Calendar Event | Todo Field | Notes |
|----------------|------------|-------|
| `summary` | `content` | 일정 제목 |
| `start.dateTime` | `time` | HH:MM 추출 |
| `start.date` | `date` | 종일 일정 (time 없음) |
| - | `category` | 사용자 설정 기본값 |

---

## 3. NPM 패키지 선택

### Decision
`googleapis` v170+ 사용

### Rationale
- Google 공식 패키지
- 완전한 TypeScript 지원 (`calendar_v3.Schema$Event`)
- 토큰 자동 갱신 내장

### Installation

```bash
npm install googleapis
```

---

## 4. 토큰 저장 및 갱신 전략

### Decision
Supabase에 토큰 저장. `tokens` 이벤트로 갱신 감지 및 DB 업데이트.

### Rationale
- Serverless 환경에서 메모리 상태 유지 불가
- Supabase가 이미 프로젝트에 통합됨
- 별도 암호화 없이 private 테이블 + RLS로 보호 (단일 사용자 환경)

### Key Implementation

```typescript
// 토큰 갱신 이벤트 리스너
oauth2Client.on('tokens', async (tokens) => {
  await supabase
    .from('calendar_connections')
    .update({
      access_token: tokens.access_token,
      token_expiry: tokens.expiry_date,
      ...(tokens.refresh_token && { refresh_token: tokens.refresh_token }),
    })
    .eq('id', connectionId);
});
```

### Alternatives Considered
- **Supabase Vault**: 과도한 복잡도 (단일 사용자 환경)
- **pgcrypto 암호화**: 현재 요구사항에 불필요

---

## 5. 중복 판단 로직

### Decision
DB 조회로 같은 날짜의 기존 Todo 목록을 가져온 후, content + time 일치 여부로 중복 판단.

### Rationale
- 간단하고 명확한 로직
- 별도 calendar_event_id 저장 불필요
- spec 요구사항과 정확히 일치

### Key Implementation

```typescript
// 해당 날짜의 기존 todos 조회
const { data: existingTodos } = await supabase
  .from('todos')
  .select('content, time')
  .eq('date', eventDate);

// 중복 체크
const isDuplicate = existingTodos?.some(
  todo => todo.content === eventTitle && todo.time === eventTime
);

if (!isDuplicate) {
  // Todo 생성
}
```

---

## 6. 환경 변수

### Required

```env
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxx
GOOGLE_REDIRECT_URI=https://your-app.vercel.app/api/calendar/callback
```

### Google Cloud Console 설정
1. OAuth 2.0 클라이언트 ID 생성 (웹 애플리케이션)
2. 승인된 리디렉션 URI 추가
3. Calendar API 활성화

---

## Summary

| Topic | Decision |
|-------|----------|
| OAuth 라이브러리 | `googleapis` OAuth2Client |
| Calendar API | `events.list` with `singleEvents: true` |
| 토큰 저장 | Supabase `calendar_connections` 테이블 |
| 토큰 갱신 | googleapis 자동 갱신 + `tokens` 이벤트 |
| 중복 판단 | date + content + time 일치 체크 |
| 암호화 | 불필요 (단일 사용자, RLS 보호) |
