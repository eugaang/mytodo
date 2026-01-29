// T07: DatePicker 컴포넌트 (달력 팝업 연동)
import { useState } from 'react';
import { CalendarPopup } from './CalendarPopup';

interface DatePickerProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

function formatDisplayDate(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(dateStr);
  targetDate.setHours(0, 0, 0, 0);

  const diffDays = Math.round(
    (targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const weekday = weekdays[date.getDay()];

  if (diffDays === 0) return `오늘 (${weekday})`;
  if (diffDays === 1) return `내일 (${weekday})`;
  if (diffDays === -1) return `어제 (${weekday})`;

  return `${date.getMonth() + 1}/${date.getDate()} (${weekday})`;
}

function addDays(dateStr: string, days: number): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

export function DatePicker({ selectedDate, onDateChange }: DatePickerProps) {
  const [showCalendar, setShowCalendar] = useState(false);

  const handlePrev = () => onDateChange(addDays(selectedDate, -1));
  const handleNext = () => onDateChange(addDays(selectedDate, 1));

  const handleDateSelect = (date: string) => {
    onDateChange(date);
    setShowCalendar(false);
  };

  return (
    <div className="date-picker">
      <button onClick={handlePrev} className="date-nav-btn">
        &lt;
      </button>
      <span
        className="date-display clickable"
        onClick={() => setShowCalendar(true)}
      >
        {formatDisplayDate(selectedDate)}
      </span>
      <button onClick={handleNext} className="date-nav-btn">
        &gt;
      </button>

      {showCalendar && (
        <CalendarPopup
          selectedDate={selectedDate}
          onSelect={handleDateSelect}
          onClose={() => setShowCalendar(false)}
        />
      )}
    </div>
  );
}
