import { useRef, useEffect, useLayoutEffect } from 'react';

export interface ContextMenuItem {
  label: string;
  onClick: () => void;
  danger?: boolean;
}

interface ContextMenuProps {
  isOpen: boolean;
  onClose: () => void;
  position: { x: number; y: number };
  items: ContextMenuItem[];
}

export function ContextMenu({ isOpen, onClose, position, items }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // 렌더링 후 위치 조정 (DOM 직접 조작)
  useLayoutEffect(() => {
    if (!isOpen || !menuRef.current) return;

    const menu = menuRef.current;
    const rect = menu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let newX = position.x;
    let newY = position.y;

    // 오른쪽 경계 체크
    if (position.x + rect.width > viewportWidth) {
      newX = viewportWidth - rect.width - 8;
    }

    // 아래쪽 경계 체크
    if (position.y + rect.height > viewportHeight) {
      newY = viewportHeight - rect.height - 8;
    }

    // 왼쪽/위쪽 경계 체크
    if (newX < 8) newX = 8;
    if (newY < 8) newY = 8;

    menu.style.top = `${newY}px`;
    menu.style.left = `${newX}px`;
  }, [isOpen, position]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const style: React.CSSProperties = {
    position: 'fixed',
    top: position.y,
    left: position.x,
    zIndex: 1000,
  };

  return (
    <div className="context-menu" ref={menuRef} style={style}>
      {items.map((item, index) => (
        <button
          key={index}
          className={`context-menu-item ${item.danger ? 'danger' : ''}`}
          onClick={() => {
            item.onClick();
            onClose();
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
