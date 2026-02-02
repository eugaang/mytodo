// TodoList 컴포넌트 (카테고리 섹션 기반)
import type { Todo, Category } from '../types/todo';
import { TodoSection } from './TodoSection';

interface TodoListProps {
  todos: Todo[];
  isMobile: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onCategoryChange: (id: string, category: Category) => void;
  onMemoChange: (id: string, memo: string | null) => void;
  onEdit: (todo: Todo) => void;
  onMoveDate: (todo: Todo) => void;
}

export function TodoList({
  todos,
  isMobile,
  onToggle,
  onDelete,
  onCategoryChange,
  onMemoChange,
  onEdit,
  onMoveDate,
}: TodoListProps) {
  const workTodos = todos.filter((t) => t.category === 'work');
  const personalTodos = todos.filter((t) => t.category === 'personal');

  if (todos.length === 0) {
    return <p className="empty-message">할 일이 없습니다.</p>;
  }

  return (
    <div className="todo-sections">
      <TodoSection
        category="work"
        todos={workTodos}
        isMobile={isMobile}
        onToggle={onToggle}
        onDelete={onDelete}
        onCategoryChange={onCategoryChange}
        onMemoChange={onMemoChange}
        onEdit={onEdit}
        onMoveDate={onMoveDate}
      />
      <TodoSection
        category="personal"
        todos={personalTodos}
        isMobile={isMobile}
        onToggle={onToggle}
        onDelete={onDelete}
        onCategoryChange={onCategoryChange}
        onMemoChange={onMemoChange}
        onEdit={onEdit}
        onMoveDate={onMoveDate}
      />
    </div>
  );
}
