# Implementation Plan: TODO App

**Branch**: `001-todo-app` | **Date**: 2026-01-28 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-todo-app/spec.md`

## Summary

CRUD 기능을 갖춘 간단한 TODO 앱 구현. React 프론트엔드와 Express 백엔드로 구성하며, JSON 파일을 데이터 저장소로 사용. 단일 사용자, 오프라인 우선 환경.

## Technical Context

**Language/Version**: TypeScript 5.x (Frontend & Backend)
**Primary Dependencies**: React 18+, Vite, Express, Node.js
**Storage**: JSON 파일 (학습용 단순화)
**Testing**: 수동 테스트 (학습 목적으로 최소화)
**Target Platform**: 웹 브라우저 (데스크톱/모바일)
**Project Type**: Web application (Frontend + Backend)
**Performance Goals**: 3초 이내 TODO 추가, 1초 이내 완료 토글
**Constraints**: 오프라인 우선, 로컬 환경에서 동작
**Scale/Scope**: 단일 사용자, 수십~수백 개 TODO 항목

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| 원칙 | 준수 여부 | 검증 |
|------|-----------|------|
| I. Simplicity First | ✅ | JSON 파일 저장, 최소 기능만 구현 |
| II. Type Safety | ✅ | TypeScript 전면 사용, 인터페이스 정의 |
| III. Clear Separation | ✅ | React(UI) / Express(API) 분리 |
| IV. Incremental Progress | ✅ | P1→P2 순서로 기능별 구현 |

## Project Structure

### Documentation (this feature)

```text
specs/001-todo-app/
├── plan.md              # 이 파일
├── research.md          # Phase 0: 기술 결정 사항
├── data-model.md        # Phase 1: 데이터 모델
├── quickstart.md        # Phase 1: 빠른 시작 가이드
├── contracts/           # Phase 1: API 계약
│   └── api.yaml         # OpenAPI 스펙
└── tasks.md             # Phase 2: 구현 작업 목록
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/
│   │   └── todo.ts          # TODO 타입 정의
│   ├── services/
│   │   └── todoService.ts   # 비즈니스 로직
│   ├── api/
│   │   └── todoRoutes.ts    # REST 엔드포인트
│   └── index.ts             # Express 서버 진입점
├── data/
│   └── todos.json           # 데이터 저장소
└── package.json

frontend/
├── src/
│   ├── components/
│   │   ├── TodoItem.tsx     # 개별 항목 컴포넌트
│   │   ├── TodoList.tsx     # 목록 컴포넌트
│   │   └── TodoInput.tsx    # 입력 컴포넌트
│   ├── services/
│   │   └── api.ts           # API 호출 함수
│   ├── types/
│   │   └── todo.ts          # 공유 타입 정의
│   ├── App.tsx              # 메인 앱 컴포넌트
│   └── main.tsx             # Vite 진입점
├── index.html
└── package.json
```

**Structure Decision**: Constitution의 "Clear Separation" 원칙에 따라 Frontend/Backend 분리 구조 선택. 학습 목적이므로 모노레포 없이 두 개의 독립적인 프로젝트로 구성.

## Complexity Tracking

> 현재 Constitution 위반 사항 없음. 모든 원칙 준수.
