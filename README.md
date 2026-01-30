# TODO App 4.0

SDD(Spec-Driven Development) 방법론으로 개발한 할일 관리 앱

## 기능

- **Google Calendar 연동**: OAuth 2.0으로 캘린더 일정을 자동으로 가져오기
- **자동 카테고리 분류**: 캘린더 이름 기반 회사/개인 자동 분류
- **날짜별 관리**: 달력 팝업으로 날짜 선택
- **카테고리 분류**: 회사/개인 섹션 분리 표시, 클릭으로 수동 변경
- **시간 지정**: 선택적 시간 입력, 시간순 정렬
- **완료 관리**: Done 클릭 시 상단 이동
- **미완료 이동**: 미완료 항목을 다음 7일 중 원하는 날짜로 이동
- **PWA 지원**: 모바일 홈 화면 설치 가능

## 기술 스택

- **Frontend**: React 19 + TypeScript 5 + Vite 7
- **Backend**: Vercel Serverless Functions
- **Database**: Supabase (PostgreSQL)
- **Auth**: Google OAuth 2.0
- **Deploy**: Vercel

## 프로젝트 구조

```
├── frontend/           # React 프론트엔드
│   ├── src/
│   │   ├── components/ # UI 컴포넌트
│   │   ├── services/   # API 서비스
│   │   └── types/      # TypeScript 타입
│   └── public/         # 정적 파일 (PWA)
├── api/                # Vercel Serverless API
│   ├── lib/            # Supabase, Google OAuth 클라이언트
│   ├── todos/          # TODO CRUD 엔드포인트
│   └── calendar/       # Google Calendar 연동 API
├── supabase/           # DB 마이그레이션
└── specs/              # SDD 문서
```

## 로컬 개발

### 환경 변수 설정

```bash
# .env.local
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/calendar/callback
```

### 실행

```bash
npm install
vercel dev
```

## Supabase 스키마

```sql
-- todos 테이블
CREATE TABLE todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  category TEXT DEFAULT 'personal' CHECK (category IN ('work', 'personal')),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  time TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Google Calendar 연결 정보
CREATE TABLE calendar_connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  token_expiry BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 배포

```bash
vercel --prod
```

## 버전 히스토리

| 버전 | 주요 기능 |
|------|----------|
| 1.0 | 기본 CRUD |
| 2.0 | 날짜별 관리, 카테고리, Done 버튼, 내일로 복사 |
| 3.0 | 달력 팝업, 카테고리 섹션 분리, 시간 입력 |
| 4.0 | Google Calendar 연동, 자동 분류, 미완료 이동 |
