// 카테고리별 섹션 컴포넌트
import type { Todo, Category } from '../types/todo';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../types/todo';
import { TodoItem } from './TodoItem';

interface TodoSectionProps {
  category: Category;
  todos: Todo[];
  isMobile: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onCategoryChange: (id: string, category: Category) => void;
  onMemoChange: (id: string, memo: string | null) => void;
  onEdit: (todo: Todo) => void;
  onMoveDate: (todo: Todo) => void;
}

export function TodoSection({
  category,
  todos,
  isMobile,
  onToggle,
  onDelete,
  onCategoryChange,
  onMemoChange,
  onEdit,
  onMoveDate,
}: TodoSectionProps) {
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
            isMobile={isMobile}
            onToggle={onToggle}
            onDelete={onDelete}
            onCategoryChange={onCategoryChange}
            onMemoChange={onMemoChange}
            onEdit={onEdit}
            onMoveDate={onMoveDate}
          />
        ))}
      </ul>
    </div>
  );
}
