// T010, T011: Todo API 엔드포인트
// v2.0: 날짜별 조회, 카테고리, 복사 기능 추가

import { Router } from 'express';
import * as todoService from '../services/todoService';

const router = Router();

// T004, T011: GET /api/todos?date=YYYY-MM-DD
router.get('/', (req, res) => {
  const date = req.query.date as string | undefined;

  if (date) {
    const todos = todoService.getByDate(date);
    res.json(todos);
  } else {
    // 날짜 미지정 시 오늘 날짜
    const today = new Date().toISOString().split('T')[0];
    const todos = todoService.getByDate(today);
    res.json(todos);
  }
});

// T006, T010: POST /api/todos (카테고리, 날짜 지원)
router.post('/', (req, res) => {
  const { content, category, date } = req.body;
  const todo = todoService.create({ content, category, date });

  if (!todo) {
    return res.status(400).json({ message: 'Content cannot be empty' });
  }

  res.status(201).json(todo);
});

// T009: POST /api/todos/copy-to-next-day
router.post('/copy-to-next-day', (req, res) => {
  const { sourceDate } = req.body;

  if (!sourceDate) {
    return res.status(400).json({ message: 'sourceDate is required' });
  }

  const result = todoService.copyToNextDay(sourceDate);

  if (result.copiedCount === 0) {
    return res.status(400).json({ message: '복사할 미완료 항목이 없습니다' });
  }

  res.json(result);
});

// T018: PATCH /api/todos/:id (Phase 4)
router.patch('/:id', (req, res) => {
  const todo = todoService.toggle(req.params.id);

  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  res.json(todo);
});

// T022: DELETE /api/todos/:id (Phase 5)
router.delete('/:id', (req, res) => {
  const success = todoService.remove(req.params.id);

  if (!success) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  res.status(204).send();
});

export default router;
