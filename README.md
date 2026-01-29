# TODO App 3.0

SDD(Spec-Driven Development) 방법론으로 개발한 할일 관리 앱

## 기능

- **날짜별 관리**: 달력 팝업으로 날짜 선택
- **카테고리 분류**: 회사/개인 섹션 분리 표시
- **시간 지정**: 선택적 시간 입력, 시간순 정렬
- **완료 관리**: Done 클릭 시 상단 이동
- **내일로 복사**: 미완료 항목 다음 날로 복사
- **PWA 지원**: 모바일 홈 화면 설치 가능

## 기술 스택

- **Frontend**: React + TypeScript + Vite
- **Backend**: Vercel Serverless Functions
- **Database**: Supabase (PostgreSQL)
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
│   ├── lib/            # Supabase 클라이언트
│   └── todos/          # TODO CRUD 엔드포인트
└── specs/              # SDD 문서
    ├── 002-todo-v2/    # v2.0 스펙
    └── 003-todo-v3/    # v3.0 스펙
```

## 로컬 개발

### 환경 변수 설정

```bash
# .env.local
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 실행

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend (로컬 Express 서버)
cd backend
npm install
npm run dev
```

## Supabase 스키마

```sql
CREATE TABLE todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  category TEXT DEFAULT 'personal' CHECK (category IN ('work', 'personal')),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  time TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations" ON todos
  FOR ALL USING (true) WITH CHECK (true);
```

## 배포

Vercel CLI를 사용하여 배포:

```bash
vercel --prod
```

## SDD 문서

- [v2.0 Spec](specs/002-todo-v2/spec.md)
- [v3.0 Spec](specs/003-todo-v3/spec.md)

## 버전 히스토리

| 버전 | 주요 기능 |
|------|----------|
| 1.0 | 기본 CRUD |
| 2.0 | 날짜별 관리, 카테고리, Done 버튼, 내일로 복사 |
| 3.0 | 달력 팝업, 카테고리 섹션 분리, 시간 입력 |
