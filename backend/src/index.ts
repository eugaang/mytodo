// T005: Express 서버 기본 설정
// v2.0: 서버 시작 시 데이터 마이그레이션

import express from 'express';
import cors from 'cors';
import todoRoutes from './api/todoRoutes';
import { migrateDataIfNeeded } from './services/todoService';

const app = express();
const PORT = 3000;

// T003: 서버 시작 시 마이그레이션 실행
migrateDataIfNeeded();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/todos', todoRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
