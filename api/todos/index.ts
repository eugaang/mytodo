import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase, Todo } from '../lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const { date } = req.query;

      let query = supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: true });

      if (date && typeof date === 'string') {
        query = query.eq('date', date);
      }

      const { data, error } = await query;

      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      const { content, category = 'personal', date } = req.body;

      if (!content) {
        return res.status(400).json({ error: 'Content is required' });
      }

      const todoDate = date || new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('todos')
        .insert({ content, category, date: todoDate })
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json(data);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
