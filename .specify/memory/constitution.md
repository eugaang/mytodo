# TODO App Constitution

## Core Principles

### I. Simplicity First

모든 기능은 가장 단순한 형태로 구현한다.

- 복잡한 추상화보다 명확한 코드를 우선
- YAGNI (You Aren't Gonna Need It) 원칙 준수
- 한 컴포넌트/함수는 하나의 책임만 가짐

### II. Type Safety

TypeScript의 타입 시스템을 적극 활용한다.

- `any` 타입 사용 금지
- API 응답과 요청에 명확한 인터페이스 정의
- 런타임 에러를 컴파일 타임에 방지

### III. Clear Separation

프론트엔드와 백엔드의 역할을 명확히 분리한다.

- React: UI 렌더링과 사용자 상호작용
- Node.js: 데이터 처리와 비즈니스 로직
- REST API로 통신, 명확한 계약(contract) 유지

### IV. Incremental Progress

작은 단위로 기능을 완성하고 검증한다.

- 하나의 기능이 완전히 동작한 후 다음으로
- 명세 → 구현 → 확인 사이클 준수
- 큰 변경보다 작은 변경의 연속

## Tech Stack

- **Frontend**: React 18+, TypeScript, Vite
- **Backend**: Node.js, Express, TypeScript
- **Database**: JSON 파일 (학습용 단순화)
- **Package Manager**: npm 또는 pnpm

## Development Workflow

1. 명세(Spec)에서 요구사항 확인
2. 해당 요구사항에 맞는 코드 구현
3. 수동 테스트로 동작 확인
4. 명세와 구현의 일치 여부 검증

## Governance

- Constitution은 프로젝트의 최상위 규칙
- 명세 변경 시 관련 코드도 함께 수정
- 원칙 위반 시 해당 코드는 리팩토링 대상

**Version**: 1.0.0 | **Ratified**: 2026-01-28 | **Last Amended**: 2026-01-28
