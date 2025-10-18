import type { VercelRequest, VercelResponse } from '@vercel/node';
import 'dotenv/config';
import { generateSitemapDynamic } from './generateSitemap.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const sitemap = await generateSitemapDynamic();
    res.setHeader('Content-Type', 'application/xml');
    return res.send(sitemap);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return res.status(500).send('Error generating sitemap');
  }
}
