import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sourceDate } = req.body;

    if (!sourceDate) {
      return res.status(400).json({ error: 'sourceDate is required' });
    }

    // 다음 날 계산
    const nextDate = new Date(sourceDate);
    nextDate.setDate(nextDate.getDate() + 1);
    const targetDate = nextDate.toISOString().split('T')[0];

    // 미완료 항목 조회
    const { data: incompleteTodos, error: fetchError } = await supabase
      .from('todos')
      .select('*')
      .eq('date', sourceDate)
      .eq('completed', false);

    if (fetchError) throw fetchError;

    if (!incompleteTodos || incompleteTodos.length === 0) {
      return res.status(200).json({
        copiedCount: 0,
        targetDate,
        copiedTodos: []
      });
    }

    // 다음 날로 복사
    const todosToInsert = incompleteTodos.map(todo => ({
      content: todo.content,
      category: todo.category,
      date: targetDate,
      completed: false
    }));

    const { data: copiedTodos, error: insertError } = await supabase
      .from('todos')
      .insert(todosToInsert)
      .select();

    if (insertError) throw insertError;

    return res.status(200).json({
      copiedCount: copiedTodos?.length || 0,
      targetDate,
      copiedTodos: copiedTodos || []
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
