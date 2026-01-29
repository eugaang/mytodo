// T015, T019, T020, T021, T022, T023: TodoItem 컴포넌트
// v2.0: Done 버튼, 카테고리 표시

import type { Todo } from '../types/todo';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <li className="todo-item">
      <span
        className="category-badge"
        style={{ backgroundColor: CATEGORY_COLORS[todo.category] }}
      >
        {CATEGORY_LABELS[todo.category]}
      </span>
      <span className={todo.completed ? 'completed' : ''}>
        {todo.content}
      </span>
      <button
        className={`done-btn ${todo.completed ? 'done' : ''}`}
        onClick={() => onToggle(todo.id)}
      >
        {todo.completed ? '취소' : 'Done'}
      </button>
      <button className="delete-btn" onClick={() => onDelete(todo.id)}>
        삭제
      </button>
    </li>
  );
}
