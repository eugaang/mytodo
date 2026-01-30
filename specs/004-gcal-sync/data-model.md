# Data Model: Google Calendar Sync

**Feature**: 004-gcal-sync | **Date**: 2026-01-30

## Entities

### 1. CalendarConnection (신규)

Google 계정 연결 상태 및 OAuth 토큰 저장.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, auto-generated | 고유 식별자 |
| `google_email` | TEXT | NOT NULL | 연결된 Google 계정 이메일 |
| `access_token` | TEXT | NOT NULL | OAuth access token |
| `refresh_token` | TEXT | NOT NULL | OAuth refresh token |
| `token_expiry` | BIGINT | NULL | Access token 만료 시간 (Unix timestamp ms) |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | 생성 시간 |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | 수정 시간 |

**Notes**:
- 단일 사용자 환경이므로 `user_id` 불필요
- 최대 1개 row만 존재 (기존 연결 시 덮어쓰기)

### 2. Todo (기존 - 변경 없음)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, auto-generated | 고유 식별자 |
| `content` | TEXT | NOT NULL | 할 일 내용 |
| `completed` | BOOLEAN | DEFAULT FALSE | 완료 여부 |
| `category` | TEXT | CHECK ('work', 'personal') | 카테고리 |
| `date` | DATE | NOT NULL | 날짜 (YYYY-MM-DD) |
| `time` | TEXT | NULL | 시간 (HH:MM, optional) |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | 생성 시간 |

**Notes**:
- 캘린더에서 가져온 Todo도 동일한 구조 사용
- `calendar_event_id` 별도 저장하지 않음 (중복 판단은 content + time으로)

### 3. ImportSettings (신규 - localStorage)

가져오기 관련 사용자 설정. DB 대신 브라우저 localStorage에 저장.

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `gcal_default_category` | 'work' \| 'personal' | 'personal' | 가져온 일정의 기본 카테고리 |

---

## Supabase Schema Changes

### New Table: calendar_connections

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

-- RLS: 모든 작업 허용 (단일 사용자 환경)
ALTER TABLE calendar_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations" ON calendar_connections
  FOR ALL USING (true) WITH CHECK (true);
```

### No Changes to: todos

기존 `todos` 테이블 스키마 변경 없음.

---

## TypeScript Interfaces

### CalendarConnection

```typescript
// frontend/src/types/calendar.ts

export interface CalendarConnection {
  id: string;
  google_email: string;
  access_token: string;
  refresh_token: string;
  token_expiry: number | null;
  created_at: string;
  updated_at: string;
}

export interface CalendarConnectionStatus {
  connected: boolean;
  email: string | null;
}
```

### CalendarEvent (Google API Response)

```typescript
// frontend/src/types/calendar.ts

export interface CalendarEvent {
  id: string;
  summary: string;           // 일정 제목 → Todo.content
  start: {
    dateTime?: string;       // ISO 8601 (시간 있는 일정)
    date?: string;           // YYYY-MM-DD (종일 일정)
  };
  end: {
    dateTime?: string;
    date?: string;
  };
}
```

### SyncResult

```typescript
// frontend/src/types/calendar.ts

export interface SyncResult {
  success: boolean;
  imported: number;          // 새로 추가된 일정 수
  skipped: number;           // 중복으로 건너뛴 일정 수
  total: number;             // 전체 캘린더 일정 수
  message: string;
}
```

---

## State Transitions

### CalendarConnection Lifecycle

```
[None] → connect → [Connected]
                        ↓
                   disconnect
                        ↓
                    [None]
```

### Sync Flow States

```
[Idle] → click sync → [Loading] → success → [Idle] (show result)
                          ↓
                        error → [Idle] (show error)
```

---

## Validation Rules

### CalendarConnection
- `google_email`: 유효한 이메일 형식
- `access_token`: 비어있지 않은 문자열
- `refresh_token`: 비어있지 않은 문자열

### Todo (Calendar Import)
- `content`: 캘린더 summary가 비어있으면 "(제목 없음)" 사용
- `time`: HH:MM 형식, 종일 일정은 null
- `date`: YYYY-MM-DD 형식
- `category`: ImportSettings에서 가져온 기본값
