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
    const { sourceDate, targetDate } = req.body;

    if (!sourceDate || !targetDate) {
      return res.status(400).json({ error: 'sourceDate and targetDate are required' });
    }

    // 미완료 항목 조회
    const { data: incompleteTodos, error: fetchError } = await supabase
      .from('todos')
      .select('*')
      .eq('date', sourceDate)
      .eq('completed', false);

    if (fetchError) throw fetchError;

    if (!incompleteTodos || incompleteTodos.length === 0) {
      return res.status(200).json({
        movedCount: 0,
        targetDate,
        movedTodos: []
      });
    }

    // 타겟 날짜로 새로 생성
    const todosToInsert = incompleteTodos.map(todo => ({
      content: todo.content,
      category: todo.category,
      date: targetDate,
      time: todo.time,
      completed: false
    }));

    const { data: movedTodos, error: insertError } = await supabase
      .from('todos')
      .insert(todosToInsert)
      .select();

    if (insertError) throw insertError;

    // 원본 삭제
    const idsToDelete = incompleteTodos.map(todo => todo.id);
    const { error: deleteError } = await supabase
      .from('todos')
      .delete()
      .in('id', idsToDelete);

    if (deleteError) throw deleteError;

    return res.status(200).json({
      movedCount: movedTodos?.length || 0,
      targetDate,
      movedTodos: movedTodos || []
    });
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
