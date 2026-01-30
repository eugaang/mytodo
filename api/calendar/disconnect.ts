import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../lib/supabase';

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
    const { error } = await supabase
      .from('calendar_connections')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (error) {
      console.error('Disconnect error:', error);
      return res.status(500).json({
        error: 'DISCONNECT_FAILED',
        message: '연결 해제에 실패했습니다',
      });
    }

    res.json({
      success: true,
      message: 'Google Calendar disconnected',
    });
  } catch (error) {
    console.error('Disconnect error:', error);
    res.status(500).json({
      error: 'DISCONNECT_FAILED',
      message: '연결 해제에 실패했습니다',
    });
  }
}
