# Quickstart: Google Calendar Sync

**Feature**: 004-gcal-sync | **Date**: 2026-01-30

## Prerequisites

### 1. Google Cloud Console 설정

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 프로젝트 생성 또는 선택
3. **APIs & Services > Library**에서 "Google Calendar API" 활성화
4. **APIs & Services > Credentials**에서 OAuth 2.0 클라이언트 ID 생성:
   - Application type: **Web application**
   - Authorized redirect URIs:
     - 개발: `http://localhost:5173/api/calendar/callback`
     - 프로덕션: `https://your-app.vercel.app/api/calendar/callback`
5. Client ID와 Client Secret 복사

### 2. 환경 변수 설정

```bash
# .env.local (로컬 개발)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5173/api/calendar/callback

# Vercel (프로덕션)
# Dashboard > Settings > Environment Variables에서 설정
```

### 3. Supabase 테이블 생성

```sql
CREATE TABLE calendar_connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  google_email TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  token_expiry BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE calendar_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations" ON calendar_connections
  FOR ALL USING (true) WITH CHECK (true);
```

### 4. 패키지 설치

```bash
# 루트 디렉토리에서
npm install googleapis
```

---

## Development Workflow

### 로컬 개발 서버 실행

```bash
# 터미널 1: Frontend
cd frontend && npm run dev

# 터미널 2: Vercel dev (API)
vercel dev
```

### 테스트 순서

1. **연결 테스트**: "Google 캘린더 연결" 버튼 클릭 → Google 로그인 → 권한 승인
2. **상태 확인**: 연결 후 이메일 표시 확인
3. **동기화 테스트**: "구글 캘린더 가져오기" 버튼 클릭 → Todo 추가 확인
4. **중복 테스트**: 다시 "가져오기" 클릭 → 중복 건너뛰기 확인
5. **연결 해제**: "연결 해제" 버튼 클릭 → 상태 초기화 확인

---

## API Usage Examples

### 연결 상태 확인

```typescript
const response = await fetch('/api/calendar/status');
const { connected, email } = await response.json();
// { connected: true, email: "user@gmail.com" }
```

### 일정 동기화

```typescript
const response = await fetch('/api/calendar/sync', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ category: 'work' }),
});
const result = await response.json();
// { success: true, imported: 5, skipped: 2, total: 7, message: "..." }
```

### 연결 해제

```typescript
const response = await fetch('/api/calendar/disconnect', {
  method: 'POST',
});
const { success } = await response.json();
```

---

## Troubleshooting

### "redirect_uri_mismatch" 오류
- Google Cloud Console의 Authorized redirect URIs 확인
- 정확한 URL 일치 필요 (슬래시, 포트 포함)

### "invalid_grant" 오류
- Refresh token이 만료됨 (사용자가 Google에서 앱 접근 권한 취소)
- 연결 해제 후 다시 연결 필요

### 토큰 갱신 실패
- `GOOGLE_CLIENT_SECRET` 환경 변수 확인
- Google Cloud Console에서 credentials 재발급 고려

---

## File Structure After Implementation

```
api/
├── lib/
│   ├── supabase.ts          # 기존
│   └── google.ts            # 신규
└── calendar/
    ├── connect.ts           # GET - OAuth 시작
    ├── callback.ts          # GET - OAuth 콜백
    ├── status.ts            # GET - 연결 상태
    ├── sync.ts              # POST - 일정 동기화
    └── disconnect.ts        # POST - 연결 해제

frontend/src/
├── components/
│   └── GoogleCalendarButton.tsx  # 신규
├── services/
│   └── googleCalendar.ts         # 신규
└── types/
    └── calendar.ts               # 신규
```
