// T016: App.tsx - 컴포넌트 조합 및 API 연동
// v2.0: 날짜별 관리, 카테고리, 복사 기능

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

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(getToday());

  // T017, T018: 날짜 변경 시 TODO 새로고침
  useEffect(() => {
    loadTodos(selectedDate);
  }, [selectedDate]);

  const loadTodos = async (date: string) => {
    try {
      setLoading(true);
      const data = await getTodos(date);
      setTodos(data);
      setError(null);
    } catch (e) {
      setError('할 일을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // T020: 카테고리 포함 추가
  const handleAdd = async (content: string, category: Category) => {
    try {
      const newTodo = await createTodo(content, category, selectedDate);
      setTodos([...todos, newTodo]);
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
      setTodos(todos.map((t) => (t.id === id ? updated : t)));
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

  // T024, T025, T026: 내일로 복사
  const handleCopyToNextDay = async () => {
    try {
      const result = await copyToNextDay(selectedDate);
      setMessage(`${result.copiedCount}개 항목이 ${result.targetDate}로 복사되었습니다.`);
      setError(null);
      // 3초 후 메시지 삭제
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
      <h1>TODO App 2.0</h1>
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
