import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getTokensFromCode, getUserInfo } from '../lib/google';
import { supabase } from '../lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED', message: 'Only GET allowed' });
  }

  const { code, error } = req.query;

  if (error) {
    return res.redirect('/?gcal=error&reason=denied');
  }

  if (!code || typeof code !== 'string') {
    return res.redirect('/?gcal=error&reason=no_code');
  }

  try {
    const tokens = await getTokensFromCode(code);

    if (!tokens.access_token || !tokens.refresh_token) {
      return res.redirect('/?gcal=error&reason=no_tokens');
    }

    const userInfo = await getUserInfo(tokens.access_token);
    const email = userInfo.email || 'unknown';

    // Upsert: 기존 연결이 있으면 덮어쓰기
    await supabase
      .from('calendar_connections')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    const { error: insertError } = await supabase
      .from('calendar_connections')
      .insert({
        google_email: email,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_expiry: tokens.expiry_date || null,
      });

    if (insertError) {
      console.error('Insert error:', insertError);
      return res.redirect('/?gcal=error&reason=db_error');
    }

    res.redirect('/?gcal=connected');
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.redirect('/?gcal=error&reason=callback_failed');
  }
}
