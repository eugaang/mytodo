// T13: TodoItem 컴포넌트 (시간 배지 표시, 카테고리 토글)
import type { Todo, Category } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onCategoryChange: (id: string, category: Category) => void;
}

export function TodoItem({ todo, onToggle, onDelete, onCategoryChange }: TodoItemProps) {
  const toggleCategory = () => {
    const newCategory: Category = todo.category === 'work' ? 'personal' : 'work';
    onCategoryChange(todo.id, newCategory);
  };

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      {todo.time && todo.time !== null && (
        <span className="time-badge">{todo.time}</span>
      )}
      <span
        className={`category-badge ${todo.category}`}
        onClick={toggleCategory}
        title="클릭하여 카테고리 변경"
        style={{ cursor: 'pointer' }}
      >
        {todo.category === 'work' ? 'W' : 'P'}
      </span>
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
