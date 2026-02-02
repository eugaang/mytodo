import { useState } from 'react';
import type { Todo, Category } from '../types/todo';
import { BottomSheet } from './BottomSheet';

interface TodoEditModalProps {
  todo: Todo | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: { content: string; time: string | null; category: Category; memo: string | null }) => void;
  isMobile: boolean;
}

export function TodoEditModal({ todo, isOpen, onClose, onSave, isMobile }: TodoEditModalProps) {
  // 초기값을 todo에서 직접 가져옴
  const [content, setContent] = useState(todo?.content || '');
  const [time, setTime] = useState(todo?.time || '');
  const [category, setCategory] = useState<Category>(todo?.category || 'personal');
  const [memo, setMemo] = useState(todo?.memo || '');

  // todo가 변경되면 상태 업데이트 (key prop으로 리렌더 유도)
  if (todo && content !== todo.content && isOpen) {
    setContent(todo.content);
    setTime(todo.time || '');
    setCategory(todo.category);
    setMemo(todo.memo || '');
  }

  const handleSave = () => {
    if (!content.trim()) return;
    onSave({
      content: content.trim(),
      time: time || null,
      category,
      memo: memo.trim() || null,
    });
    onClose();
  };

  const formContent = (
    <div className="todo-edit-form">
      <div className="form-group">
        <label>내용</label>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="form-input"
          autoFocus={!isMobile}
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>시간</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="form-input form-time"
          />
        </div>
        <div className="form-group">
          <label>카테고리</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="form-select"
          >
            <option value="work">회사</option>
            <option value="personal">개인</option>
          </select>
        </div>
      </div>
      <div className="form-group">
        <label>메모</label>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          className="form-textarea"
          rows={3}
          placeholder="메모를 입력하세요..."
        />
      </div>
      <div className="form-actions">
        <button className="form-cancel-btn" onClick={onClose}>
          취소
        </button>
        <button className="form-save-btn" onClick={handleSave}>
          저장
        </button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <BottomSheet isOpen={isOpen} onClose={onClose} title="일정 수정">
        {formContent}
      </BottomSheet>
    );
  }

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>일정 수정</h3>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>
        {formContent}
      </div>
    </div>
  );
}
