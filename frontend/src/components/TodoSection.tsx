// T08: 카테고리별 섹션 컴포넌트
import type { Todo, Category } from '../types/todo';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../types/todo';
import { TodoItem } from './TodoItem';

interface TodoSectionProps {
  category: Category;
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoSection({ category, todos, onToggle, onDelete }: TodoSectionProps) {
  if (todos.length === 0) return null;

  return (
    <div className="todo-section">
      <div
        className="section-header"
        style={{ borderLeftColor: CATEGORY_COLORS[category] }}
      >
        {CATEGORY_LABELS[category]}
      </div>
      <ul className="todo-list">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </div>
  );
}
