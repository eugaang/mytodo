// TodoList 컴포넌트 (카테고리 섹션 기반)
import type { Todo, Category } from '../types/todo';
import { TodoItem } from './TodoItem';
import { TodoSection } from './TodoSection';

interface TodoListProps {
  todos: Todo[];
  viewMode: 'combined' | 'split';
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
  viewMode,
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

  if (viewMode === 'combined') {
    const timeline = [...todos].sort((a, b) => {
      if (!!a.time !== !!b.time) return a.time ? -1 : 1;
      return (a.time || '').localeCompare(b.time || '')
        || (a.created_at || '').localeCompare(b.created_at || '')
        || a.id.localeCompare(b.id);
    });
    return (
      <ul className="todo-list" aria-label="전체 일정 시간순">
        {timeline.map((todo) => (
          <TodoItem key={todo.id} todo={todo} isMobile={isMobile}
            onToggle={onToggle} onDelete={onDelete} onCategoryChange={onCategoryChange}
            onMemoChange={onMemoChange} onEdit={onEdit} onMoveDate={onMoveDate} />
        ))}
      </ul>
    );
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
