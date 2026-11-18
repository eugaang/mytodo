# TODO App 4.0

SDD(Spec-Driven Development) 방법론으로 개발한 할일 관리 앱

## 기능

- **날짜별 관리**: 달력 팝업으로 날짜 선택
- **보기 전환**: 함께보기(완료 여부와 관계없이 시간순, 시간 미지정은 마지막) / 나눠보기(회사·개인 분리), 선택 자동 저장
- **카테고리 분류**: 회사/개인 배지 클릭으로 변경
- **시간 지정**: 선택적 시간 입력, 시간순 정렬
- **완료 관리**: 나눠보기에서는 완료 항목 상단 이동, 함께보기에서는 시간순 유지
- **미완료 이동**: 미완료 항목을 다음 7일 중 원하는 날짜로 이동
- **PWA 지원**: 모바일 홈 화면 설치 가능

## 기술 스택

- **Frontend**: React 19 + TypeScript 5 + Vite 7
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
│   ├── todos/          # TODO CRUD 엔드포인트
├── supabase/           # DB 마이그레이션
└── specs/              # SDD 문서
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

## 이번 변경

Google Calendar 연동 UI와 API를 제거했습니다. 기존 일정과 DB 마이그레이션 이력은 유지합니다. 배포 후 Google OAuth 환경 변수는 더 이상 사용하지 않습니다. 하단 메모창은 화면 여유 공간에 따라 위쪽으로 열립니다.
