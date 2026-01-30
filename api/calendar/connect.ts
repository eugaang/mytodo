import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAuthUrl } from '../lib/google';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED', message: 'Only GET allowed' });
  }

  try {
    const authUrl = getAuthUrl();
    res.redirect(302, authUrl);
  } catch (error) {
    console.error('OAuth connect error:', error);
    res.status(500).json({ error: 'OAUTH_ERROR', message: 'Failed to initiate OAuth flow' });
  }
}
