// T13: TodoItem 컴포넌트 (시간 배지 표시)
import type { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      {todo.time && (
        <span className="time-badge">{todo.time}</span>
      )}
      <span className="todo-content">
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
