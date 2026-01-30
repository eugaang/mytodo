import type { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';
import { getAuthenticatedClient } from '../lib/google';
import { supabase } from '../lib/supabase';

interface Todo {
  content: string;
  category: string;
  date: string;
  time: string | null;
  completed: boolean;
}

interface CalendarInfo {
  id: string;
  summary: string;
  category: 'work' | 'personal';
}

const WORK_KEYWORDS = ['work', 'business', '업무', '회사', '직장', '미팅', 'meeting', 'office'];

function isWorkCalendar(calendarName: string): boolean {
  const lowerName = calendarName.toLowerCase();
  return WORK_KEYWORDS.some(keyword => lowerName.includes(keyword));
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatTime(dateTime: string): string {
  const date = new Date(dateTime);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED', message: 'Only POST allowed' });
  }

  try {
    const oauth2Client = await getAuthenticatedClient();
    if (!oauth2Client) {
      return res.status(401).json({
        error: 'NOT_CONNECTED',
        message: 'Google Calendar이 연결되지 않았습니다',
      });
    }

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // 캘린더 목록 가져와서 work/personal 자동 분류
    const calendarList = await calendar.calendarList.list();
    const calendars: CalendarInfo[] = (calendarList.data.items || []).map(cal => ({
      id: cal.id || 'primary',
      summary: cal.summary || '',
      category: isWorkCalendar(cal.summary || '') ? 'work' : 'personal',
    }));

    const now = new Date();
    const weekLater = new Date(now);
    weekLater.setDate(weekLater.getDate() + 7);

    let imported = 0;
    let skipped = 0;
    let totalEvents = 0;

    // 모든 캘린더에서 이벤트 가져오기
    for (const cal of calendars) {
      const response = await calendar.events.list({
        calendarId: cal.id,
        timeMin: now.toISOString(),
        timeMax: weekLater.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
        maxResults: 250,
      });

      const events = response.data.items || [];
      totalEvents += events.length;

      for (const event of events) {
        const summary = event.summary || '(제목 없음)';
        let eventDate: string;
        let eventTime: string | null = null;

        if (event.start?.dateTime) {
          eventDate = formatDate(new Date(event.start.dateTime));
          eventTime = formatTime(event.start.dateTime);
        } else if (event.start?.date) {
          eventDate = event.start.date;
          eventTime = null;
        } else {
          continue;
        }

        // 중복 체크: 같은 날짜, content, time
        const { data: existing } = await supabase
          .from('todos')
          .select('id')
          .eq('date', eventDate)
          .eq('content', summary)
          .eq('time', eventTime)
          .limit(1);

        if (existing && existing.length > 0) {
          skipped++;
          continue;
        }

        // 캘린더 이름 기반 자동 분류
        const newTodo: Todo = {
          content: summary,
          category: cal.category,
          date: eventDate,
          time: eventTime,
          completed: false,
        };

        const { error: insertError } = await supabase
          .from('todos')
          .insert(newTodo);

        if (insertError) {
          console.error('Insert error:', insertError);
          continue;
        }

        imported++;
      }
    }

    const total = totalEvents;
    let message: string;
    if (imported === 0 && skipped === 0) {
      message = '가져올 일정이 없습니다';
    } else if (imported === 0) {
      message = `모든 일정이 이미 존재합니다 (${skipped}개)`;
    } else if (skipped === 0) {
      message = `${imported}개의 일정을 가져왔습니다`;
    } else {
      message = `${imported}개의 일정을 가져왔습니다 (${skipped}개 중복 건너뜀)`;
    }

    res.json({
      success: true,
      imported,
      skipped,
      total,
      message,
    });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({
      error: 'SYNC_FAILED',
      message: '일정 동기화에 실패했습니다',
    });
  }
}
