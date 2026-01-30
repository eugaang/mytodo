# mytodo 프로젝트 작업 요약

## 프로젝트 개요

SDD(Spec-Driven Development) 방법론을 학습하기 위해 GitHub의 spec-kit 도구를 사용하여 TODO 앱을 개발하는 프로젝트

## SDD 단계별 의미와 목적

| 단계 | 질문 | 산출물 | 핵심 목적 |
|------|------|--------|-----------|
| **Spec** | "무엇을 만들까?" | User Stories, FR, 시나리오 | AI에게 **범위**를 제한 |
| **Plan** | "어떻게 만들까?" | 기술 스택, 구조, API 계약 | AI에게 **기술 결정**을 고정 |
| **Tasks** | "무슨 순서로?" | 체크리스트, 의존성 | AI에게 **실행 단위**를 지정 |

### 누가 작성하는가? (사람 vs AI)

| 단계 | 사람 | AI | 협업 방식 |
|------|------|-----|----------|
| **Spec** | 70% | 30% | 사람이 "무엇을 원하는지" 정의, AI는 구조화 |
| **Plan** | 30% | 70% | AI가 기술 결정 제안, 사람이 검토/승인 |
| **Tasks** | 10% | 90% | AI가 Plan 기반으로 자동 분해, 사람은 확인 |
| **Implement** | 5% | 95% | AI가 코드 작성, 사람은 검수 |

**실제 워크플로우 예시**:

```text
[Spec 단계]
사람: "날짜별 관리, Done 버튼, 회사/개인 분류, 복사 기능"
  ↓
AI: User Story, FR, Acceptance Scenario로 구조화
  ↓
사람: 검토 후 "수정 기능은 빼줘" 같은 피드백

[Plan 단계]
AI: 기술 스택, API 설계, 마이그레이션 전략 제안
  ↓
사람: "이 방식으로 진행해" 또는 "Redis 대신 JSON 파일로"

[Tasks 단계]
AI: Plan 기반으로 Task 체크리스트 자동 생성
  ↓
사람: 대부분 그대로 승인 (수정 거의 없음)
```

**핵심 원칙**:
- **사람의 역할**: "What"을 결정 (도메인 전문가)
- **AI의 역할**: "How"를 결정하고 실행 (기술 전문가)

### 각 단계의 역할

- **Spec**: 사용자 관점의 기능 정의. "이것만 만들어라, 더도 말고 덜도 말고"
- **Plan**: 아키텍처와 기술 결정. "이 기술로, 이 구조로 만들어라"
- **Tasks**: 파일 단위 체크리스트. "이 순서로, 이 파일에 작성해라"

### 왜 이렇게 나누는가?

```text
추상적 ────────────────────────────────► 구체적

Spec          Plan           Tasks         Code
"TODO 추가"   "POST API"    "T010 작성"   실제 코드
   ↓             ↓              ↓
 범위 제한    기술 고정      실행 단위화
```

**각 단계가 AI의 재량을 점점 줄여서 B'' (의도치 않은 구현) 위험을 감소시킴**

## 진행 상황

### 2026-01-28

#### 1. SDD 개념 논의

- SDD는 명세를 중심으로 구현을 지속적으로 조정하는 개발 방법론
- 핵심 문제: 명세 A → A' 변경 시, AI가 의도치 않게 B'' (예상치 못한 구현)을 만들 수 있음
- 해결 방안:
  - 결정론적 생성기(Generator) 활용
  - 계약 테스트(Contract Testing)
  - Diff 중심 리뷰
  - 사람의 역할: 코더 → 검수자

#### 2. spec-kit 설치

```bash
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
```

- 설치 버전: specify-cli v0.0.22

#### 3. 프로젝트 초기화

```bash
specify init . --ai claude
```

- AI assistant: Claude
- 생성된 구조:
  - `.claude/commands/` - 슬래시 커맨드 정의
  - `.specify/memory/` - constitution 등 메모리
  - `.specify/templates/` - 각 단계별 템플릿

#### 4. Constitution 작성 완료 (v1.0.0)

**핵심 원칙:**

| 원칙 | 내용 |
|------|------|
| I. Simplicity First | YAGNI, 단일 책임 원칙 |
| II. Type Safety | any 금지, 명확한 인터페이스 |
| III. Clear Separation | Frontend/Backend 분리, REST API |
| IV. Incremental Progress | 작은 단위로 완성 후 다음 |

**기술 스택:**

- Frontend: React 18+, TypeScript, Vite
- Backend: Node.js, Express, TypeScript
- Database: JSON 파일 (학습용)

#### 5. Specify 단계 완료

**브랜치**: `001-todo-app`

**명세 파일**: `specs/001-todo-app/spec.md`

**User Stories (우선순위순):**

| Priority | Story | 설명 |
|----------|-------|------|
| P1 | TODO 항목 추가 | 할 일 입력 후 목록에 추가 |
| P1 | TODO 항목 완료 표시 | 체크박스로 완료/미완료 토글 |
| P2 | TODO 항목 삭제 | 목록에서 항목 제거 |

**Functional Requirements (FR-001 ~ FR-007):**

- 생성, 조회, 완료 토글, 삭제 (수정 제외)
- 데이터 영구 저장
- 빈 문자열 검증

**Key Entity:**

- TODO Item: id, content, completed, createdAt

**품질 검증**: 체크리스트 전 항목 통과 ✅

#### 6. Plan 단계 완료

**생성된 문서:**

| 파일 | 설명 |
|------|------|
| plan.md | 기술 계획서 (구조, 기술 스택) |
| research.md | 기술 결정 사항 (Vite, useState, fetch 등) |
| data-model.md | Todo 엔티티 정의, 검증 규칙 |
| contracts/api.yaml | OpenAPI 스펙 (REST API 계약) |
| quickstart.md | 프로젝트 설정 및 실행 가이드 |

**Constitution Check**: 전 원칙 준수 ✅

**프로젝트 구조 결정:**

```text
backend/          # Express + TypeScript
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── data/todos.json

frontend/         # React + Vite + TypeScript
└── src/
    ├── components/
    ├── services/
    └── types/
```

**API 엔드포인트:**

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | /api/todos | 전체 조회 |
| POST | /api/todos | 생성 |
| PATCH | /api/todos/:id | 완료 토글 |
| DELETE | /api/todos/:id | 삭제 |

#### 7. Tasks 단계 완료

**생성된 파일**: `specs/001-todo-app/tasks.md`

**Task 구성 (총 26개):**

| Phase | Tasks | 설명 |
|-------|-------|------|
| Setup | 2 | Backend/Frontend 초기화 |
| Foundational | 5 | 공통 타입, 서버 설정 |
| US1 (추가) | 9 | MVP - 핵심 CRUD |
| US2 (완료) | 4 | 상태 토글 |
| US3 (삭제) | 3 | 항목 제거 |
| Polish | 3 | 스타일링, 에러 처리 |

**MVP 전략**: US1만 완료해도 동작하는 앱

**병렬 실행 가능**: Setup, 컴포넌트 생성 등 [P] 태스크

#### 8. Implement 단계 완료 🎉

**구현된 코드:**

Backend (`backend/`):
- `src/models/todo.ts` - Todo 타입 정의
- `src/services/todoService.ts` - CRUD 비즈니스 로직
- `src/api/todoRoutes.ts` - REST API 엔드포인트
- `src/index.ts` - Express 서버
- `data/todos.json` - 데이터 저장소

Frontend (`frontend/`):
- `src/types/todo.ts` - Todo 타입
- `src/services/api.ts` - API 호출 함수
- `src/components/TodoInput.tsx` - 입력 컴포넌트
- `src/components/TodoList.tsx` - 목록 컴포넌트
- `src/components/TodoItem.tsx` - 항목 컴포넌트
- `src/App.tsx` - 메인 앱
- `src/App.css` - 스타일링

**실행 방법:**
```bash
# Backend
cd backend && npm run dev

# Frontend (다른 터미널)
cd frontend && npm run dev
```

---

### 2026-01-29

#### 9. TODO 2.0 Spec 작성 완료

**브랜치**: `002-todo-v2`

**신규 기능 (4가지)**:

| Priority | 기능 | 설명 |
|----------|------|------|
| P1 | 날짜별 관리 | 날짜 선택기로 날짜별 TODO 분리 |
| P1 | Done 버튼 | 취소선으로 완료 표시 (삭제와 분리) |
| P2 | 카테고리 | 회사/개인 분류 (색상 구분) |
| P2 | 복사 기능 | 미완료 항목을 다음 날짜로 복사 |

**확장된 Todo 엔티티**:

```typescript
interface Todo {
  id: string;
  content: string;
  completed: boolean;
  category: 'work' | 'personal';  // 신규
  date: string;                    // 신규 (YYYY-MM-DD)
  createdAt: string;
}
```

#### 10. TODO 2.0 Plan 작성 완료

**생성된 문서**:

| 파일 | 설명 |
|------|------|
| plan.md | 2.0 기술 계획 (마이그레이션 전략 포함) |
| data-model.md | 확장된 데이터 모델 |
| contracts/api.yaml | OpenAPI 2.0 스펙 |

**신규 API 엔드포인트**:

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | /api/todos?date=YYYY-MM-DD | 날짜별 조회 |
| POST | /api/todos/copy-to-next-day | 미완료 항목 복사 |

**마이그레이션 전략**: 서버 시작 시 기존 데이터에 기본값 자동 적용

#### 11. TODO 2.0 Tasks 작성 완료

**Task 구성 (총 29개)**:

| Phase | Tasks | 설명 |
|-------|-------|------|
| 0. Migration | 3 | 데이터 마이그레이션 |
| 1. Core API | 4 | 날짜 기반 API 수정 |
| 2. Copy API | 2 | 복사 기능 API |
| 3. Types | 5 | 프론트엔드 타입 |
| 4. Date Nav | 4 | 날짜 선택 UI |
| 5. Category | 3 | 카테고리 기능 |
| 6. Done & Copy | 5 | 버튼 및 복사 UI |
| 7. Styling | 3 | 스타일 마무리 |

## SDD 워크플로우 진행 현황

### TODO 1.0 (완료)
- [x] Constitution - 프로젝트 원칙 정의
- [x] Specify - 요구사항 명세
- [x] Plan - 기술 계획
- [x] Tasks - 작업 분해
- [x] Implement - 구현 ✅

### TODO 2.0 (완료)
- [x] Specify - 요구사항 명세 ✅
- [x] Plan - 기술 계획 ✅
- [x] Tasks - 작업 분해 ✅
- [x] Implement - 구현 ✅ (29개 Task 완료)

#### 12. TODO 2.0 Implement 완료

**구현된 기능**:

1. **날짜별 관리**: DatePicker 컴포넌트로 날짜 이동, 날짜별 TODO 분리
2. **Done 버튼**: 체크박스 대신 Done/취소 버튼, 취소선 스타일
3. **카테고리**: 회사(파랑)/개인(초록) 선택, 배지 표시
4. **복사 기능**: 미완료 항목 다음 날짜로 복사

**마이그레이션**: 기존 v1 데이터 자동 변환 (category=personal, date=createdAt)

**실행 방법**:
```bash
# Backend
cd backend && npm run dev  # http://localhost:3000

# Frontend
cd frontend && npm run dev  # http://localhost:5173
```

## 파일 구조

```text
mytodo/
├── .claude/commands/          # 슬래시 커맨드
├── .specify/
│   ├── memory/
│   │   └── constitution.md    # 프로젝트 원칙
│   └── templates/             # 템플릿
├── specs/
│   ├── 001-todo-app/          # TODO 1.0 (완료)
│   │   ├── spec.md
│   │   ├── plan.md
│   │   ├── tasks.md
│   │   └── contracts/api.yaml
│   └── 002-todo-v2/           # TODO 2.0 (완료)
│       ├── spec.md            # ✅
│       ├── plan.md            # ✅
│       ├── data-model.md      # ✅
│       ├── tasks.md           # ✅
│       └── contracts/api.yaml # ✅
├── backend/                   # Express + TypeScript (v2.0)
├── frontend/                  # React + Vite + TypeScript (v2.0)
└── summary.md                 # 작업 요약 (이 파일)
```

## SDD 체험 요약

**1.0 → 2.0 진화 과정에서 SDD의 장점**:

| 장점 | 설명 |
|------|------|
| **범위 통제** | Spec에서 4개 기능만 정의 → 불필요한 기능 추가 방지 |
| **기술 결정 고정** | Plan에서 마이그레이션 전략 정의 → 일관된 구현 |
| **작업 추적** | Tasks에서 29개 체크리스트 → 빠짐없이 구현 |
| **하위 호환성** | 데이터 마이그레이션으로 기존 사용자 데이터 보존 |

## 다음 단계

SDD 워크플로우 완료. 추가 기능 요청 시 새로운 Spec 브랜치 생성

---

*마지막 업데이트: 2026-01-29*
