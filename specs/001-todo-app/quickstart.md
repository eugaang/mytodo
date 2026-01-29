# Quickstart: TODO App

## 필수 요구사항

- Node.js 18+
- npm 또는 pnpm

## 프로젝트 설정

### 1. Backend 설정

```bash
# 백엔드 디렉토리 생성 및 초기화
mkdir -p backend && cd backend
npm init -y
npm install express cors
npm install -D typescript @types/node @types/express @types/cors ts-node

# TypeScript 설정
npx tsc --init
```

### 2. Frontend 설정

```bash
# 프론트엔드 생성 (Vite + React + TypeScript)
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
```

## 실행 방법

### Backend 실행

```bash
cd backend
npm run dev
# 서버: http://localhost:3000
```

### Frontend 실행

```bash
cd frontend
npm run dev
# 앱: http://localhost:5173
```

## API 엔드포인트

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | /api/todos | 모든 TODO 조회 |
| POST | /api/todos | 새 TODO 생성 |
| PATCH | /api/todos/:id | 완료 상태 토글 |
| DELETE | /api/todos/:id | TODO 삭제 |

## 디렉토리 구조

```
speckit/
├── backend/
│   ├── src/
│   │   ├── models/todo.ts
│   │   ├── services/todoService.ts
│   │   ├── api/todoRoutes.ts
│   │   └── index.ts
│   └── data/todos.json
└── frontend/
    └── src/
        ├── components/
        ├── services/api.ts
        └── App.tsx
```
