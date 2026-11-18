import { useState, useEffect } from 'react';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { DatePicker } from './components/DatePicker';
import { TodoEditModal } from './components/TodoEditModal';
import { DateMoveSelector } from './components/DateMoveSelector';
import { getTodos, createTodo, toggleTodo, deleteTodo, moveToDate, updateCategory, updateTodo, updateMemo, moveSingleTodo } from './services/api';
import { useDeviceType } from './hooks/useDeviceType';
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

// 다음 7일 계산
function getNextDays(baseDate: string): { date: string; label: string }[] {
  const days: { date: string; label: string }[] = [];
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const base = new Date(baseDate);

  for (let i = 1; i <= 7; i++) {
    const nextDate = new Date(base);
    nextDate.setDate(base.getDate() + i);
    const dateStr = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}-${String(nextDate.getDate()).padStart(2, '0')}`;
    const dayName = dayNames[nextDate.getDay()];
    const month = nextDate.getMonth() + 1;
    const day = nextDate.getDate();
    days.push({ date: dateStr, label: `${month}/${day} (${dayName})` });
  }
  return days;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [viewMode, setViewMode] = useState<'combined' | 'split'>(() => {
    try {
      return localStorage.getItem('mytodo:view-mode:v1') === 'split' ? 'split' : 'combined';
    } catch {
      return 'combined';
    }
  });

  const changeViewMode = (mode: 'combined' | 'split') => {
    setViewMode(mode);
    try {
      localStorage.setItem('mytodo:view-mode:v1', mode);
    } catch {
      // The view still works when browser storage is unavailable.
    }
  };
  const [showMoveOptions, setShowMoveOptions] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [movingTodo, setMovingTodo] = useState<Todo | null>(null);
  const { isMobile } = useDeviceType();

  useEffect(() => {
    loadTodos(selectedDate);
  }, [selectedDate]);

  const loadTodos = async (date: string) => {
    try {
      setLoading(true);
      const data = await getTodos(date);
      setTodos(sortTodos(data));
      setError(null);
    } catch {
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
    } catch {
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
    } catch {
      setError('상태 변경에 실패했습니다.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter((t) => t.id !== id));
      setError(null);
    } catch {
      setError('삭제에 실패했습니다.');
    }
  };

  const handleMoveToDate = async (targetDate: string) => {
    try {
      const result = await moveToDate(selectedDate, targetDate);
      setMessage(`${result.movedCount}개 항목이 ${targetDate}로 이동되었습니다.`);
      setShowMoveOptions(false);
      setError(null);
      // 원본이 삭제되었으므로 목록 새로고침
      loadTodos(selectedDate);
      setTimeout(() => setMessage(null), 3000);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('이동에 실패했습니다.');
      }
    }
  };

  const handleCategoryChange = async (id: string, category: Category) => {
    try {
      const updated = await updateCategory(id, category);
      const newTodos = todos.map((t) => (t.id === id ? updated : t));
      setTodos(sortTodos(newTodos));
      setError(null);
    } catch {
      setError('카테고리 변경에 실패했습니다.');
    }
  };

  const handleMemoChange = async (id: string, memo: string | null) => {
    try {
      const updated = await updateMemo(id, memo);
      const newTodos = todos.map((t) => (t.id === id ? updated : t));
      setTodos(sortTodos(newTodos));
      setError(null);
    } catch {
      setError('메모 저장에 실패했습니다.');
    }
  };

  const handleEditTodo = async (updates: { content: string; time: string | null; category: Category; memo: string | null }) => {
    if (!editingTodo) return;
    try {
      const updated = await updateTodo(editingTodo.id, updates);
      const newTodos = todos.map((t) => (t.id === editingTodo.id ? updated : t));
      setTodos(sortTodos(newTodos));
      setEditingTodo(null);
      setError(null);
    } catch {
      setError('일정 수정에 실패했습니다.');
    }
  };

  const handleMoveSingleTodo = async (targetDate: string) => {
    if (!movingTodo) return;
    try {
      await moveSingleTodo(movingTodo.id, targetDate);
      setTodos(todos.filter((t) => t.id !== movingTodo.id));
      setMovingTodo(null);
      setMessage(`일정이 ${targetDate}로 이동되었습니다.`);
      setTimeout(() => setMessage(null), 3000);
      setError(null);
    } catch {
      setError('일정 이동에 실패했습니다.');
    }
  };

  const incompleteTodos = todos.filter((t) => !t.completed);

  return (
    <div className="app">
      <h1 onClick={() => loadTodos(selectedDate)} style={{ cursor: 'pointer' }}>MyTodo</h1>
      <DatePicker selectedDate={selectedDate} onDateChange={setSelectedDate} />
      {error && <p className="error">{error}</p>}
      {message && <p className="message">{message}</p>}
      <TodoInput onAdd={handleAdd} />
      {incompleteTodos.length > 0 && (
        <div className="move-section">
          <button className="move-btn" onClick={() => setShowMoveOptions(!showMoveOptions)}>
            미완료 {incompleteTodos.length}개 이동 {showMoveOptions ? '▲' : '▼'}
          </button>
          {showMoveOptions && (
            <div className="move-options">
              {getNextDays(selectedDate).map(({ date, label }) => (
                <button
                  key={date}
                  className="move-option-btn"
                  onClick={() => handleMoveToDate(date)}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      <div className="view-mode-toggle" role="group" aria-label="일정 보기 방식">
        <button type="button" aria-pressed={viewMode === 'combined'} onClick={() => changeViewMode('combined')}>함께보기</button>
        <button type="button" aria-pressed={viewMode === 'split'} onClick={() => changeViewMode('split')}>나눠보기</button>
      </div>
      {loading ? (
        <p>로딩 중...</p>
      ) : (
        <TodoList
          todos={todos}
          viewMode={viewMode}
          isMobile={isMobile}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onCategoryChange={handleCategoryChange}
          onMemoChange={handleMemoChange}
          onEdit={setEditingTodo}
          onMoveDate={setMovingTodo}
        />
      )}

      {/* 일정 수정 모달/바텀시트 */}
      <TodoEditModal
        todo={editingTodo}
        isOpen={!!editingTodo}
        onClose={() => setEditingTodo(null)}
        onSave={handleEditTodo}
        onDelete={() => {
          if (editingTodo) {
            handleDelete(editingTodo.id);
            setEditingTodo(null);
          }
        }}
        isMobile={isMobile}
      />

      {/* 단일 항목 날짜 이동 선택기 */}
      <DateMoveSelector
        isOpen={!!movingTodo}
        onClose={() => setMovingTodo(null)}
        onSelectDate={handleMoveSingleTodo}
        currentDate={selectedDate}
        isMobile={isMobile}
      />
    </div>
  );
}

export default App;
