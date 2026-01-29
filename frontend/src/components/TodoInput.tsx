// T013, T019: TodoInput 컴포넌트 (v2.0 - 카테고리 선택)

import { useState } from 'react';
import type { Category } from '../types/todo';
import { CATEGORY_LABELS } from '../types/todo';

interface TodoInputProps {
  onAdd: (content: string, category: Category) => void;
}

export function TodoInput({ onAdd }: TodoInputProps) {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Category>('personal');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onAdd(content, category);
      setContent('');
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
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="할 일을 입력하세요"
      />
      <button type="submit">추가</button>
    </form>
  );
}
