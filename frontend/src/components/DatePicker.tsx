// T015: DatePicker 컴포넌트 (이전/다음 버튼, 날짜 표시)

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
  const handlePrev = () => onDateChange(addDays(selectedDate, -1));
  const handleNext = () => onDateChange(addDays(selectedDate, 1));
  const handleToday = () => onDateChange(new Date().toISOString().split('T')[0]);

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  return (
    <div className="date-picker">
      <button onClick={handlePrev} className="date-nav-btn">
        &lt;
      </button>
      <span className="date-display">{formatDisplayDate(selectedDate)}</span>
      <button onClick={handleNext} className="date-nav-btn">
        &gt;
      </button>
      {!isToday && (
        <button onClick={handleToday} className="today-btn">
          오늘
        </button>
      )}
    </div>
  );
}
