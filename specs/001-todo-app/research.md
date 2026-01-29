# Research: TODO App

**Date**: 2026-01-28
**Feature**: 001-todo-app

## 기술 결정 사항

### 1. 프론트엔드 빌드 도구

**Decision**: Vite
**Rationale**: React + TypeScript 프로젝트에서 가장 빠른 개발 서버와 HMR 제공
**Alternatives considered**:
- Create React App: 더 이상 권장되지 않음, 느림
- Next.js: SSR 불필요, 과도한 복잡성

### 2. 상태 관리

**Decision**: React useState (로컬 상태)
**Rationale**: TODO 목록 하나만 관리하므로 별도 상태 관리 라이브러리 불필요 (Simplicity First)
**Alternatives considered**:
- Redux: 과도한 보일러플레이트
- Zustand: 학습 목적에서는 불필요한 의존성

### 3. API 통신

**Decision**: fetch API (브라우저 내장)
**Rationale**: 단순한 CRUD 요청에 axios 등 외부 라이브러리 불필요
**Alternatives considered**:
- Axios: 추가 의존성, 이 규모에서는 과도함
- React Query: 캐싱/동기화 기능 불필요

### 4. 데이터 저장

**Decision**: JSON 파일 (서버 로컬)
**Rationale**: Constitution에 명시된 학습용 단순화, DB 설정 오버헤드 제거
**Alternatives considered**:
- SQLite: 간단하지만 여전히 추가 설정 필요
- localStorage: 서버 없이 가능하나 백엔드 학습 목적에 맞지 않음

### 5. CSS 스타일링

**Decision**: 일반 CSS (또는 CSS Modules)
**Rationale**: 단순한 UI, 별도 CSS-in-JS 라이브러리 불필요
**Alternatives considered**:
- Tailwind: 설정 오버헤드
- styled-components: 추가 의존성

## 해결된 불확실성

Constitution에서 기술 스택이 명확히 정의되어 있어 주요 결정 사항에 불확실성 없음.

| 항목 | 상태 |
|------|------|
| Language | ✅ TypeScript 확정 |
| Frontend | ✅ React + Vite 확정 |
| Backend | ✅ Express 확정 |
| Storage | ✅ JSON 파일 확정 |
| Testing | ✅ 수동 테스트 (최소화) |
