import { useState, useEffect, useRef } from 'react';

interface MemoEditorProps {
  memo: string | null | undefined;
  onSave: (memo: string | null) => void;
  onCancel: () => void;
  autoFocus?: boolean;
}

export function MemoEditor({ memo, onSave, onCancel, autoFocus = true }: MemoEditorProps) {
  const [value, setValue] = useState(memo || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleSave = () => {
    const trimmed = value.trim();
    onSave(trimmed.length > 0 ? trimmed : null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel();
    } else if (e.key === 'Enter' && e.metaKey) {
      handleSave();
    }
  };

  return (
    <div className="memo-editor">
      <textarea
        ref={textareaRef}
        className="memo-textarea"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="메모를 입력하세요..."
        rows={3}
      />
      <div className="memo-editor-actions">
        <button className="memo-cancel-btn" onClick={onCancel}>
          취소
        </button>
        <button className="memo-save-btn" onClick={handleSave}>
          저장
        </button>
      </div>
    </div>
  );
}
