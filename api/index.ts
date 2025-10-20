import type { VercelRequest, VercelResponse } from '@vercel/node';
import 'dotenv/config';
import { getPage } from "./getPage.ts";
import { isError } from "./helpers.ts";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const url = new URL(req.url || '/', `http://${req.headers.host}`);
    const pathname = url.pathname;

    console.log('Handling request for:', pathname);

    // Handle robots.txt - domain-specific routing
    if (pathname === '/robots.txt') {
      const host = req.headers.host || '';
      let robotsFile = '/robots.txt'; // fallback

      if (host.includes('arturwojnar.dev')) {
        robotsFile = '/public/robots-arturwojnar.txt';
      } else if (host.includes('knowhowcode.dev')) {
        robotsFile = '/public/robots-knowhowcode.txt';
      }

      const robots = await getPage(robotsFile);
      if (!isError(robots)) {
        res.setHeader('Content-Type', 'text/plain');
        return res.send(robots.result);
      }
    }

    // Handle sitemap.xml - domain-specific routing
    if (pathname === '/sitemap.xml') {
      const host = req.headers.host || '';
      let sitemapFile = '/sitemap.xml'; // fallback

      if (host.includes('arturwojnar.dev')) {
        sitemapFile = '/sitemap-arturwojnar.xml';
      } else if (host.includes('knowhowcode.dev')) {
        sitemapFile = '/sitemap-knowhowcode.xml';
      }

      const sitemap = await getPage(sitemapFile);
      if (!isError(sitemap)) {
        res.setHeader('Content-Type', 'application/xml');
        return res.send(sitemap.result);
      }
    }

    // Handle root
    if (pathname === '/') {
      const html = await getPage('/index.html');
      if (isError(html)) {
        const notFound = await getPage('/404.html');
        return res.status(404).send(isError(notFound) ? '404 Not Found' : notFound.result);
      }
      res.setHeader('Content-Type', 'text/html');
      return res.send(html.result);
    }

    // Handle /articles
    if (pathname === '/articles') {
      const html = await getPage('/articles/index.html');
      if (isError(html)) {
        const notFound = await getPage('/404.html');
        return res.status(404).send(isError(notFound) ? '404 Not Found' : notFound.result);
      }
      res.setHeader('Content-Type', 'text/html');
      return res.send(html.result);
    }

    // Handle /articles/:slug
    if (pathname.startsWith('/articles/')) {
      const html = await getPage(`${pathname}/index.html`);
      if (isError(html)) {
        const notFound = await getPage('/404.html');
        return res.status(404).send(isError(notFound) ? '404 Not Found' : notFound.result);
      }
      res.setHeader('Content-Type', 'text/html');
      return res.send(html.result);
    }

    // Handle /talks and /trainings
    if (pathname === '/talks' || pathname === '/trainings') {
      console.log('Attempting to load:', `${pathname}.html`);
      const html = await getPage(`${pathname}.html`);
      if (isError(html)) {
        console.error('Failed to load page:', pathname);
        const notFound = await getPage('/404.html');
        return res.status(404).send(isError(notFound) ? '404 Not Found' : notFound.result);
      }
      res.setHeader('Content-Type', 'text/html');
      return res.send(html.result);
    }

    // 404 for everything else
    const notFound = await getPage('/404.html');
    return res.status(404).send(isError(notFound) ? '404 Not Found' : notFound.result);
  } catch (error) {
    const notFound = await getPage('/error.html');
    return res.status(500).send(isError(notFound) ? '500 Internal Server Error' : notFound.result);
  }
}
