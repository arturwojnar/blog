import type { VercelRequest, VercelResponse } from '@vercel/node';
import 'dotenv/config';
import { supabase } from './supabaseClient.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { article } = req.query;

  if (!article || typeof article !== 'string') {
    return res.status(400).json({ error: 'Article parameter is required' });
  }

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('likes')
        .select('likes')
        .eq('article_slug', article)
        .maybeSingle();

      if (error) {
        console.error('Error fetching likes:', error);
        return res.status(500).json({ error: 'Failed to fetch likes' });
      }

      return res.json({ likes: data?.likes || 0 });
    } catch (error) {
      console.error('Error fetching likes:', error);
      return res.status(500).json({ error: 'Failed to fetch likes' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { data, error } = await supabase.rpc('increment_likes', { slug: article });

      if (error) {
        console.error('Error incrementing likes:', error);
        return res.status(500).json({ error: 'Failed to increment likes' });
      }

      return res.json({ likes: data as number });
    } catch (error) {
      console.error('Error incrementing likes:', error);
      return res.status(500).json({ error: 'Failed to increment likes' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
