// T10: TodoList 컴포넌트 (카테고리 섹션 기반)
import type { Todo } from '../types/todo';
import { TodoSection } from './TodoSection';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
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
        onToggle={onToggle}
        onDelete={onDelete}
      />
      <TodoSection
        category="personal"
        todos={personalTodos}
        onToggle={onToggle}
        onDelete={onDelete}
      />
    </div>
  );
}
