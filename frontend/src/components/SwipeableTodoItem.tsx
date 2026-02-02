import { type ReactNode } from 'react';
import { useSwipe } from '../hooks/useSwipe';

interface SwipeableTodoItemProps {
  children: ReactNode;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  enabled: boolean;
}

export function SwipeableTodoItem({
  children,
  onSwipeLeft,
  onSwipeRight,
  enabled,
}: SwipeableTodoItemProps) {
  const { offsetX, swiping, handlers } = useSwipe({
    threshold: 80,
    onSwipeLeft,
    onSwipeRight,
  });

  if (!enabled) {
    return <>{children}</>;
  }

  const showDeleteAction = offsetX < -30;
  const showMoveAction = offsetX > 30;

  return (
    <div className="swipeable-container" {...handlers}>
      {/* 왼쪽 스와이프 액션 (삭제) */}
      <div
        className={`swipe-action swipe-action-delete ${showDeleteAction ? 'visible' : ''}`}
      >
        삭제
      </div>
      {/* 오른쪽 스와이프 액션 (날짜 이동) */}
      <div
        className={`swipe-action swipe-action-move ${showMoveAction ? 'visible' : ''}`}
      >
        이동
      </div>
      <div
        className="swipeable-content"
        style={{
          transform: `translateX(${offsetX}px)`,
          transition: swiping ? 'none' : 'transform 0.3s ease',
        }}
      >
        {children}
      </div>
    </div>
  );
}
