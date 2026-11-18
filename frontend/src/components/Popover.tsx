import { createPortal } from 'react-dom';
import { useRef, useEffect, useLayoutEffect, type ReactNode } from 'react';

interface PopoverProps {
  isOpen: boolean;
  onClose: () => void;
  anchorEl: HTMLElement | null;
  children: ReactNode;
}

export function Popover({ isOpen, onClose, anchorEl, children }: PopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        anchorEl &&
        !anchorEl.contains(e.target as Node)
      ) {
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
  }, [isOpen, onClose, anchorEl]);

  useLayoutEffect(() => {
    const popover = popoverRef.current;
    if (!isOpen || !anchorEl || !popover) return;

    const position = () => {
      const margin = 8;
      const gap = 4;
      const viewport = window.visualViewport;
      const leftEdge = viewport?.offsetLeft ?? 0;
      const topEdge = viewport?.offsetTop ?? 0;
      const width = viewport?.width ?? window.innerWidth;
      const height = viewport?.height ?? window.innerHeight;
      popover.style.maxWidth = `${Math.max(0, width - margin * 2)}px`;
      popover.style.maxHeight = `${Math.max(0, height - margin * 2)}px`;
      const anchor = anchorEl.getBoundingClientRect();
      const box = popover.getBoundingClientRect();
      const below = topEdge + height - margin - anchor.bottom - gap;
      const above = anchor.top - gap - topEdge - margin;
      const preferredTop = below < box.height && above > below
        ? anchor.top - box.height - gap
        : anchor.bottom + gap;
      popover.style.top = `${Math.max(topEdge + margin, Math.min(preferredTop, topEdge + height - margin - box.height))}px`;
      popover.style.left = `${Math.max(leftEdge + margin, Math.min(anchor.left, leftEdge + width - margin - box.width))}px`;
    };

    position();
    const observer = new ResizeObserver(position);
    observer.observe(popover);
    observer.observe(anchorEl);
    window.addEventListener('resize', position);
    window.addEventListener('scroll', position, true);
    window.visualViewport?.addEventListener('resize', position);
    window.visualViewport?.addEventListener('scroll', position);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', position);
      window.removeEventListener('scroll', position, true);
      window.visualViewport?.removeEventListener('resize', position);
      window.visualViewport?.removeEventListener('scroll', position);
    };
  }, [isOpen, anchorEl]);

  if (!isOpen || !anchorEl) return null;

  return createPortal(
    <div className="popover" ref={popoverRef}
      role="dialog" aria-label="메모"
      style={{ position: 'fixed', zIndex: 1000 }}
      onClick={(event) => event.stopPropagation()}
      onDoubleClick={(event) => event.stopPropagation()}
      onContextMenu={(event) => event.stopPropagation()}
    >
      {children}
    </div>,
    document.body,
  );
}
