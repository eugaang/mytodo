import { useState, useRef } from 'react';

interface SwipeState {
  offsetX: number;
  swiping: boolean;
}

interface UseSwipeOptions {
  threshold?: number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export function useSwipe({
  threshold = 80,
  onSwipeLeft,
  onSwipeRight,
}: UseSwipeOptions) {
  const [state, setState] = useState<SwipeState>({ offsetX: 0, swiping: false });
  const startX = useRef(0);
  const startY = useRef(0);
  const isHorizontal = useRef<boolean | null>(null);
  const currentOffsetX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    isHorizontal.current = null;
    currentOffsetX.current = 0;
    setState({ offsetX: 0, swiping: true });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - startX.current;
    const diffY = currentY - startY.current;

    // 첫 이동에서 방향 결정
    if (isHorizontal.current === null) {
      if (Math.abs(diffX) > 10 || Math.abs(diffY) > 10) {
        isHorizontal.current = Math.abs(diffX) > Math.abs(diffY);
      }
    }

    // 수평 스와이프인 경우에만 처리
    if (isHorizontal.current) {
      currentOffsetX.current = diffX;
      setState({ offsetX: diffX, swiping: true });
    }
  };

  const handleTouchEnd = () => {
    const offsetX = currentOffsetX.current;

    if (Math.abs(offsetX) >= threshold) {
      if (offsetX < 0 && onSwipeLeft) {
        onSwipeLeft();
      } else if (offsetX > 0 && onSwipeRight) {
        onSwipeRight();
      }
    }

    setState({ offsetX: 0, swiping: false });
    isHorizontal.current = null;
    currentOffsetX.current = 0;
  };

  return {
    offsetX: state.offsetX,
    swiping: state.swiping,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
}
