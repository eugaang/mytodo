// T11: TodoInput 컴포넌트 (v3.0 - 시간 입력 추가)
import { useState } from 'react';
import type { Category } from '../types/todo';
import { CATEGORY_LABELS } from '../types/todo';

interface TodoInputProps {
  onAdd: (content: string, category: Category, time?: string) => void;
}

export function TodoInput({ onAdd }: TodoInputProps) {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Category>('personal');
  const [time, setTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onAdd(content, category, time || undefined);
      setContent('');
      setTime('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-input">
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value as Category)}
        className="category-select"
      >
        <option value="personal">{CATEGORY_LABELS.personal}</option>
        <option value="work">{CATEGORY_LABELS.work}</option>
      </select>
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="time-input"
      />
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="할 일을 입력하세요"
        className="content-input"
      />
      <button type="submit">추가</button>
    </form>
  );
}
