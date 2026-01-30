import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED', message: 'Only GET allowed' });
  }

  try {
    const { data: connection } = await supabase
      .from('calendar_connections')
      .select('google_email')
      .limit(1)
      .single();

    if (connection) {
      res.json({
        connected: true,
        email: connection.google_email,
      });
    } else {
      res.json({
        connected: false,
        email: null,
      });
    }
  } catch (error) {
    console.error('Status check error:', error);
    res.json({
      connected: false,
      email: null,
    });
  }
}
