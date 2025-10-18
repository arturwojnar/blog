import type { VercelRequest, VercelResponse } from '@vercel/node';
import 'dotenv/config';
import { getPage } from "./getPage.ts";
import { isError } from "./helpers.ts";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const url = new URL(req.url || '/', `http://${req.headers.host}`);
  const pathname = url.pathname;

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
    const html = await getPage(`${pathname}.html`);
    if (isError(html)) {
      const notFound = await getPage('/404.html');
      return res.status(404).send(isError(notFound) ? '404 Not Found' : notFound.result);
    }
    res.setHeader('Content-Type', 'text/html');
    return res.send(html.result);
  }

  // 404 for everything else
  const notFound = await getPage('/404.html');
  return res.status(404).send(isError(notFound) ? '404 Not Found' : notFound.result);
}
