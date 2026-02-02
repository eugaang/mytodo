import { useState, useRef, type ReactNode } from 'react';

interface SwipeableTodoItemProps {
  children: ReactNode;
  onDelete: () => void;
  onMoveDate: () => void;
  enabled: boolean;
}

export function SwipeableTodoItem({
  children,
  onDelete,
  onMoveDate,
  enabled,
}: SwipeableTodoItemProps) {
  const [revealedAction, setRevealedAction] = useState<'delete' | 'move' | null>(null);
  const startX = useRef(0);
  const startY = useRef(0);

  if (!enabled) {
    return <>{children}</>;
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
    setRevealedAction(null);
  };

  const handleMoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMoveDate();
    setRevealedAction(null);
  };

  const handleSwipeLeft = () => {
    setRevealedAction(revealedAction === 'delete' ? null : 'delete');
  };

  const handleSwipeRight = () => {
    setRevealedAction(revealedAction === 'move' ? null : 'move');
  };

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const diffX = endX - startX.current;
    const diffY = endY - startY.current;

    // 수평 스와이프인 경우에만 처리
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      if (diffX < 0) {
        handleSwipeLeft();
      } else {
        handleSwipeRight();
      }
    }
  };

  const getTransform = () => {
    if (revealedAction === 'delete') return 'translateX(-80px)';
    if (revealedAction === 'move') return 'translateX(80px)';
    return 'translateX(0)';
  };

  return (
    <div className="swipeable-container">
      {/* 삭제 버튼 (오른쪽에 위치) */}
      <button
        className={`swipe-action-btn swipe-action-delete ${revealedAction === 'delete' ? 'visible' : ''}`}
        onClick={handleDeleteClick}
      >
        삭제
      </button>
      {/* 이동 버튼 (왼쪽에 위치) */}
      <button
        className={`swipe-action-btn swipe-action-move ${revealedAction === 'move' ? 'visible' : ''}`}
        onClick={handleMoveClick}
      >
        이동
      </button>
      <div
        className="swipeable-content"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onClick={() => revealedAction && setRevealedAction(null)}
        style={{
          transform: getTransform(),
          transition: 'transform 0.3s ease',
        }}
      >
        {children}
      </div>
    </div>
  );
}
