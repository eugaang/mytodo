// T15: App.tsx - v3.0 통합
// 달력 팝업, 카테고리 섹션, 시간 정렬

import { useState, useEffect } from 'react';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { DatePicker } from './components/DatePicker';
import { getTodos, createTodo, toggleTodo, deleteTodo, copyToNextDay } from './services/api';
import type { Todo, Category } from './types/todo';
import './App.css';

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

// T14: 정렬 로직 - 완료 우선, 시간순, 생성순
function sortTodos(todos: Todo[]): Todo[] {
  return [...todos].sort((a, b) => {
    // 1. 완료 항목 우선 (상단)
    if (a.completed !== b.completed) {
      return a.completed ? -1 : 1;
    }
    // 2. 시간 있는 항목 우선 (null 체크)
    const aHasTime = a.time !== null && a.time !== undefined;
    const bHasTime = b.time !== null && b.time !== undefined;
    if (aHasTime !== bHasTime) {
      return aHasTime ? -1 : 1;
    }
    // 3. 시간순 정렬
    if (aHasTime && bHasTime) {
      return a.time!.localeCompare(b.time!);
    }
    // 4. 생성 순서
    return (a.created_at || '').localeCompare(b.created_at || '');
  });
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(getToday());

  useEffect(() => {
    loadTodos(selectedDate);
  }, [selectedDate]);

  const loadTodos = async (date: string) => {
    try {
      setLoading(true);
      const data = await getTodos(date);
      setTodos(sortTodos(data));
      setError(null);
    } catch (e) {
      setError('할 일을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // v3.0: 시간 포함 추가
  const handleAdd = async (content: string, category: Category, time?: string) => {
    try {
      const newTodo = await createTodo(content, category, selectedDate, time);
      setTodos(sortTodos([...todos, newTodo]));
      setError(null);
    } catch (e) {
      setError('할 일 추가에 실패했습니다.');
    }
  };

  const handleToggle = async (id: string) => {
    try {
      const todo = todos.find((t) => t.id === id);
      if (!todo) return;
      const updated = await toggleTodo(id, !todo.completed);
      const newTodos = todos.map((t) => (t.id === id ? updated : t));
      setTodos(sortTodos(newTodos));
      setError(null);
    } catch (e) {
      setError('상태 변경에 실패했습니다.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter((t) => t.id !== id));
      setError(null);
    } catch (e) {
      setError('삭제에 실패했습니다.');
    }
  };

  const handleCopyToNextDay = async () => {
    try {
      const result = await copyToNextDay(selectedDate);
      setMessage(`${result.copiedCount}개 항목이 ${result.targetDate}로 복사되었습니다.`);
      setError(null);
      setTimeout(() => setMessage(null), 3000);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('복사에 실패했습니다.');
      }
    }
  };

  const incompleteTodos = todos.filter((t) => !t.completed);

  return (
    <div className="app">
      <h1>TODO App 3.0</h1>
      <DatePicker selectedDate={selectedDate} onDateChange={setSelectedDate} />
      {error && <p className="error">{error}</p>}
      {message && <p className="message">{message}</p>}
      <TodoInput onAdd={handleAdd} />
      {incompleteTodos.length > 0 && (
        <button className="copy-btn" onClick={handleCopyToNextDay}>
          미완료 {incompleteTodos.length}개 내일로 복사
        </button>
      )}
      {loading ? (
        <p>로딩 중...</p>
      ) : (
        <TodoList
          todos={todos}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default App;
