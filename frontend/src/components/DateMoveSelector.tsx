import { BottomSheet } from './BottomSheet';

interface DateMoveSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDate: (date: string) => void;
  currentDate: string;
  isMobile: boolean;
}

function getNextDays(baseDate: string, count: number = 7): { date: string; label: string }[] {
  const days: { date: string; label: string }[] = [];
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const base = new Date(baseDate);

  for (let i = 1; i <= count; i++) {
    const nextDate = new Date(base);
    nextDate.setDate(base.getDate() + i);
    const dateStr = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}-${String(nextDate.getDate()).padStart(2, '0')}`;
    const dayName = dayNames[nextDate.getDay()];
    const month = nextDate.getMonth() + 1;
    const day = nextDate.getDate();
    days.push({ date: dateStr, label: `${month}/${day} (${dayName})` });
  }
  return days;
}

export function DateMoveSelector({
  isOpen,
  onClose,
  onSelectDate,
  currentDate,
  isMobile,
}: DateMoveSelectorProps) {
  const dateOptions = getNextDays(currentDate, 7);

  const content = (
    <div className="date-move-options">
      {dateOptions.map(({ date, label }) => (
        <button
          key={date}
          className="date-move-option"
          onClick={() => {
            onSelectDate(date);
            onClose();
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );

  if (isMobile) {
    return (
      <BottomSheet isOpen={isOpen} onClose={onClose} title="날짜 이동">
        {content}
      </BottomSheet>
    );
  }

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-small" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>날짜 이동</h3>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>
        {content}
      </div>
    </div>
  );
}
