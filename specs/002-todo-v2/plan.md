# Implementation Plan: TODO App 2.0

**Branch**: `002-todo-v2` | **Date**: 2026-01-29 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-todo-v2/spec.md`
**Base**: TODO App 1.0 (001-todo-app)

## Summary

기존 TODO 앱에 4가지 핵심 기능 추가: 날짜별 관리, Done 버튼(취소선), 회사/개인 분류, 다음 날짜로 복사. 기존 1.0 코드 기반으로 확장하되, 데이터 모델과 API를 하위 호환성을 고려하여 확장.

## What's New (vs 1.0)

| 기능 | 1.0 | 2.0 |
|------|-----|-----|
| 날짜별 관리 | ❌ 전체 목록 | ✅ 날짜별 분리 |
| 완료 표시 | ✅ 체크박스 | ✅ Done 버튼 + 취소선 |
| 카테고리 | ❌ 없음 | ✅ 회사/개인 |
| 복사 기능 | ❌ 없음 | ✅ 다음 날짜로 복사 |

## Technical Context

**Language/Version**: TypeScript 5.x (Frontend & Backend)
**Primary Dependencies**: React 18+, Vite, Express, Node.js
**Storage**: JSON 파일 (날짜별 인덱싱 추가)
**Testing**: 수동 테스트
**Target Platform**: 웹 브라우저 (데스크톱/모바일)
**Project Type**: Web application (Frontend + Backend)
**Performance Goals**: 3초 이내 날짜 변경, 1초 이내 복사 완료
**Constraints**: 기존 1.0 데이터와 호환 (마이그레이션 제공)

## Constitution Check

| 원칙 | 준수 여부 | 검증 |
|------|-----------|------|
| I. Simplicity First | ✅ | 최소 필드 추가 (date, category) |
| II. Type Safety | ✅ | TypeScript 유지, category는 union type |
| III. Clear Separation | ✅ | UI/비즈니스 로직/데이터 분리 유지 |
| IV. Incremental Progress | ✅ | 기존 코드 수정, 새 기능 점진적 추가 |

## Project Structure

### Documentation (this feature)

```text
specs/002-todo-v2/
├── plan.md              # 이 파일
├── data-model.md        # 확장된 데이터 모델
├── contracts/           # API 계약
│   └── api.yaml         # OpenAPI 스펙 (2.0)
└── tasks.md             # 구현 작업 목록
```

### Source Code Changes

```text
backend/
├── src/
│   ├── models/
│   │   └── todo.ts          # [수정] category, date 필드 추가
│   ├── services/
│   │   └── todoService.ts   # [수정] 날짜 필터, 복사 로직 추가
│   ├── api/
│   │   └── todoRoutes.ts    # [수정] 날짜별 조회, 복사 API 추가
│   └── index.ts             # [유지]
├── data/
│   └── todos.json           # [마이그레이션] 기존 데이터에 기본값 추가
└── package.json

frontend/
├── src/
│   ├── components/
│   │   ├── TodoItem.tsx     # [수정] Done 버튼, 카테고리 표시
│   │   ├── TodoList.tsx     # [유지]
│   │   ├── TodoInput.tsx    # [수정] 카테고리 선택 추가
│   │   └── DatePicker.tsx   # [신규] 날짜 선택 컴포넌트
│   ├── services/
│   │   └── api.ts           # [수정] 날짜별 조회, 복사 API 추가
│   ├── types/
│   │   └── todo.ts          # [수정] category, date 타입 추가
│   ├── App.tsx              # [수정] 날짜 상태 관리, 복사 기능
│   ├── App.css              # [수정] 카테고리 색상, 날짜 피커 스타일
│   └── main.tsx             # [유지]
├── index.html
└── package.json
```

## Migration Strategy

기존 1.0 데이터가 있는 경우 마이그레이션:

```typescript
// 기존 Todo (1.0)
{ id, content, completed, createdAt }

// 변환 후 Todo (2.0)
{ id, content, completed, createdAt,
  date: createdAt.split('T')[0],     // 생성일 기준
  category: 'personal'                // 기본값
}
```

## Key Design Decisions

### 1. 날짜 저장 형식
- **선택**: `YYYY-MM-DD` 문자열
- **이유**: 타임존 이슈 회피, 정렬/비교 용이

### 2. 카테고리 구현
- **선택**: 문자열 리터럴 타입 (`"work" | "personal"`)
- **이유**: 확장성과 단순성 균형, 2개 값으로 충분

### 3. 복사 vs 이동
- **선택**: 복사 (원본 유지)
- **이유**: Spec 요구사항 "복사", 실수 시 복구 가능

### 4. 날짜 선택 UI
- **선택**: 간단한 이전/다음 버튼 + 날짜 표시
- **이유**: 외부 라이브러리 없이 단순 구현

## Complexity Tracking

> 현재 Constitution 위반 사항 없음. 모든 원칙 준수.
>
> 주의 사항:
> - 날짜 관련 로직에서 타임존 문제 발생 가능 → 로컬 날짜만 사용
> - 데이터 마이그레이션 시 기존 데이터 백업 권장
