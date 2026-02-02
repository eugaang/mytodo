// TodoItem 컴포넌트 - 메모, PC/모바일 분기, 수정 기능
import { useState, useRef } from 'react';
import type { Todo, Category } from '../types/todo';
import { MemoEditor } from './MemoEditor';
import { Popover } from './Popover';
import { ContextMenu, type ContextMenuItem } from './ContextMenu';
import { SwipeableTodoItem } from './SwipeableTodoItem';
import { BottomSheet } from './BottomSheet';

interface TodoItemProps {
  todo: Todo;
  isMobile: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onCategoryChange: (id: string, category: Category) => void;
  onMemoChange: (id: string, memo: string | null) => void;
  onEdit: (todo: Todo) => void;
  onMoveDate: (todo: Todo) => void;
}

export function TodoItem({
  todo,
  isMobile,
  onToggle,
  onDelete,
  onCategoryChange,
  onMemoChange,
  onEdit,
  onMoveDate,
}: TodoItemProps) {
  const [memoPopoverAnchor, setMemoPopoverAnchor] = useState<HTMLElement | null>(null);
  const [showMemoView, setShowMemoView] = useState(false);
  const [showMemoEditor, setShowMemoEditor] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const itemRef = useRef<HTMLLIElement>(null);
  const memoIconRef = useRef<HTMLButtonElement>(null);

  const hasMemo = todo.memo && todo.memo.trim().length > 0;

  const toggleCategory = () => {
    const newCategory: Category = todo.category === 'work' ? 'personal' : 'work';
    onCategoryChange(todo.id, newCategory);
  };

  // PC: 더블클릭 -> 수정 모달
  const handleDoubleClick = () => {
    if (!isMobile) {
      onEdit(todo);
    }
  };

  // 모바일: 탭 -> 수정 바텀시트
  const handleTap = () => {
    if (isMobile) {
      onEdit(todo);
    }
  };

  // PC: 우클릭 -> 컨텍스트 메뉴
  const handleContextMenu = (e: React.MouseEvent) => {
    if (!isMobile) {
      e.preventDefault();
      setContextMenu({ x: e.clientX, y: e.clientY });
    }
  };

  // 메모 아이콘 클릭 - 메모 보기 (PC: 팝오버, 모바일: 바텀시트)
  const handleMemoIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMobile) {
      setShowMemoView(true);
    } else if (memoIconRef.current) {
      setMemoPopoverAnchor(memoIconRef.current);
    }
  };

  // 컨텍스트 메뉴에서 메모 추가 클릭
  const handleAddMemo = () => {
    if (isMobile) {
      setShowMemoEditor(true);
    } else if (itemRef.current) {
      setMemoPopoverAnchor(itemRef.current);
      setShowMemoEditor(true);
    }
  };

  const handleMemoSave = (memo: string | null) => {
    onMemoChange(todo.id, memo);
    setMemoPopoverAnchor(null);
    setShowMemoEditor(false);
    setShowMemoView(false);
  };

  const handleMemoDelete = () => {
    onMemoChange(todo.id, null);
    setMemoPopoverAnchor(null);
    setShowMemoView(false);
  };

  // 스와이프 핸들러 (모바일)
  const handleSwipeDelete = () => {
    onDelete(todo.id);
  };

  const handleSwipeMoveDate = () => {
    onMoveDate(todo);
  };

  const contextMenuItems: ContextMenuItem[] = [
    { label: '수정', onClick: () => onEdit(todo) },
    { label: hasMemo ? '메모 보기' : '메모 추가', onClick: handleAddMemo },
    { label: '날짜 이동', onClick: () => onMoveDate(todo) },
    { label: '삭제', onClick: () => onDelete(todo.id), danger: true },
  ];

  const itemContent = (
    <li
      ref={itemRef}
      className={`todo-item ${todo.completed ? 'completed' : ''}`}
      onDoubleClick={handleDoubleClick}
      onClick={isMobile ? handleTap : undefined}
      onContextMenu={handleContextMenu}
    >
      {todo.time && todo.time !== null && (
        <span className="time-badge">{todo.time}</span>
      )}
      <span
        className={`category-badge ${todo.category}`}
        onClick={(e) => {
          e.stopPropagation();
          toggleCategory();
        }}
        title="클릭하여 카테고리 변경"
        style={{ cursor: 'pointer' }}
      >
        {todo.category === 'work' ? 'W' : 'P'}
      </span>
      <span className="todo-content">{todo.content}</span>

      {/* 메모가 있을 때만 아이콘 표시 */}
      {hasMemo && (
        <button
          ref={memoIconRef}
          className="memo-icon has-memo"
          onClick={handleMemoIconClick}
          title="메모 보기"
        >
          {'\u{1F4DD}'}
        </button>
      )}

      <button
        className={`done-btn ${todo.completed ? 'done' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          onToggle(todo.id);
        }}
      >
        {todo.completed ? '취소' : 'Done'}
      </button>

      {/* PC: 메모 팝오버 (보기/편집) */}
      <Popover
        isOpen={!!memoPopoverAnchor}
        onClose={() => {
          setMemoPopoverAnchor(null);
          setShowMemoEditor(false);
        }}
        anchorEl={memoPopoverAnchor}
      >
        {showMemoEditor || !hasMemo ? (
          <MemoEditor
            memo={todo.memo}
            onSave={handleMemoSave}
            onCancel={() => {
              setMemoPopoverAnchor(null);
              setShowMemoEditor(false);
            }}
          />
        ) : (
          <div className="memo-view">
            <div className="memo-view-content">{todo.memo}</div>
            <div className="memo-view-actions">
              <button className="memo-edit-btn" onClick={() => setShowMemoEditor(true)}>
                수정
              </button>
              <button className="memo-delete-btn" onClick={handleMemoDelete}>
                삭제
              </button>
            </div>
          </div>
        )}
      </Popover>

      {/* PC: 컨텍스트 메뉴 */}
      <ContextMenu
        isOpen={!!contextMenu}
        onClose={() => setContextMenu(null)}
        position={contextMenu || { x: 0, y: 0 }}
        items={contextMenuItems}
      />
    </li>
  );

  return (
    <>
      {isMobile ? (
        <SwipeableTodoItem
          enabled={isMobile}
          onDelete={handleSwipeDelete}
          onMoveDate={handleSwipeMoveDate}
        >
          {itemContent}
        </SwipeableTodoItem>
      ) : (
        itemContent
      )}

      {/* 모바일: 메모 보기 바텀시트 */}
      <BottomSheet
        isOpen={isMobile && showMemoView && !showMemoEditor}
        onClose={() => setShowMemoView(false)}
        title="메모"
      >
        <div className="memo-view">
          <div className="memo-view-content">{todo.memo}</div>
          <div className="memo-view-actions">
            <button className="memo-edit-btn" onClick={() => setShowMemoEditor(true)}>
              수정
            </button>
            <button className="memo-delete-btn" onClick={handleMemoDelete}>
              삭제
            </button>
          </div>
        </div>
      </BottomSheet>

      {/* 모바일: 메모 편집 바텀시트 */}
      <BottomSheet
        isOpen={isMobile && showMemoEditor}
        onClose={() => {
          setShowMemoEditor(false);
          setShowMemoView(false);
        }}
        title={hasMemo ? '메모 수정' : '메모 추가'}
      >
        <MemoEditor
          memo={todo.memo}
          onSave={handleMemoSave}
          onCancel={() => {
            setShowMemoEditor(false);
            setShowMemoView(false);
          }}
        />
      </BottomSheet>
    </>
  );
}
