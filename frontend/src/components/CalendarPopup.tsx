// T05: 달력 팝업 컴포넌트
import { useState } from 'react';

interface CalendarPopupProps {
  selectedDate: string;
  onSelect: (date: string) => void;
  onClose: () => void;
}

const DAYS = ['일', '월', '화', '수', '목', '금', '토'];
const MONTHS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

export function CalendarPopup({ selectedDate, onSelect, onClose }: CalendarPopupProps) {
  const selected = new Date(selectedDate);
  const [viewYear, setViewYear] = useState(selected.getFullYear());
  const [viewMonth, setViewMonth] = useState(selected.getMonth());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const firstDay = new Date(viewYear, viewMonth, 1);
  const lastDay = new Date(viewYear, viewMonth + 1, 0);
  const startPadding = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewYear(viewYear - 1);
      setViewMonth(11);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewYear(viewYear + 1);
      setViewMonth(0);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleDateClick = (day: number) => {
    const date = new Date(viewYear, viewMonth, day);
    const dateStr = date.toISOString().split('T')[0];
    onSelect(dateStr);
  };

  const isToday = (day: number) => {
    return viewYear === today.getFullYear() &&
           viewMonth === today.getMonth() &&
           day === today.getDate();
  };

  const isSelected = (day: number) => {
    return viewYear === selected.getFullYear() &&
           viewMonth === selected.getMonth() &&
           day === selected.getDate();
  };

  const cells = [];
  for (let i = 0; i < startPadding; i++) {
    cells.push(<div key={`empty-${i}`} className="calendar-cell empty"></div>);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const classes = ['calendar-cell'];
    if (isToday(day)) classes.push('today');
    if (isSelected(day)) classes.push('selected');

    cells.push(
      <div
        key={day}
        className={classes.join(' ')}
        onClick={() => handleDateClick(day)}
      >
        {day}
      </div>
    );
  }

  return (
    <div className="calendar-overlay" onClick={onClose}>
      <div className="calendar-popup" onClick={(e) => e.stopPropagation()}>
        <div className="calendar-header">
          <button onClick={prevMonth}>&lt;</button>
          <span>{viewYear}년 {MONTHS[viewMonth]}</span>
          <button onClick={nextMonth}>&gt;</button>
        </div>
        <div className="calendar-days">
          {DAYS.map((day) => (
            <div key={day} className="calendar-day-name">{day}</div>
          ))}
        </div>
        <div className="calendar-grid">
          {cells}
        </div>
        <button className="calendar-today-btn" onClick={() => {
          const todayStr = new Date().toISOString().split('T')[0];
          onSelect(todayStr);
        }}>
          오늘
        </button>
      </div>
    </div>
  );
}
