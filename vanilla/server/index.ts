import 'dotenv/config';
import express, { type Request, type Response } from "express";
import path from "path";
import { __dirname } from "./consts.ts";
import { getPage } from "./getPage.ts";
import { isError } from "./helpers.ts";
import { generateSitemapDynamic } from "./generateSitemap.ts";
import { supabase } from "./supabaseClient.ts";

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON bodies
app.use(express.json());

const sendHtml = async (uri: string, res: Response) => {
  const html = await getPage(uri);

  if (isError(html)) {
    res.send(await getPage("/404.html"));
    return;
  }

  res.send(html.result);
};

app.use(express.static(path.join(__dirname, "../public")));

// API endpoints for likes
app.get("/api/likes/:slug", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { data, error } = await supabase
      .from('likes')
      .select('likes')
      .eq('article_slug', slug)
      .maybeSingle();

    if (error) {
      console.error('Error fetching likes:', error);
      return res.status(500).json({ error: 'Failed to fetch likes' });
    }

    res.json({ likes: data?.likes || 0 });
  } catch (error) {
    console.error('Error fetching likes:', error);
    res.status(500).json({ error: 'Failed to fetch likes' });
  }
});

app.post("/api/likes/:slug", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { data, error } = await supabase.rpc('increment_likes', { slug });

    if (error) {
      console.error('Error incrementing likes:', error);
      return res.status(500).json({ error: 'Failed to increment likes' });
    }

    res.json({ likes: data as number });
  } catch (error) {
    console.error('Error incrementing likes:', error);
    res.status(500).json({ error: 'Failed to increment likes' });
  }
});

app.get(["/"], async (req: Request, res: Response) => {
  return await sendHtml(`/index.html`, res);
});

app.get(["/articles"], async (req: Request, res: Response) => {
  return await sendHtml(`${req.path}/index.html`, res);
});

app.get("/articles/:slug", async (req: Request, res: Response) => {
  return await sendHtml(`${req.path}/index.html`, res);
});

app.get(["/talks", "/trainings"], async (req: Request, res: Response) => {
  return await sendHtml(`${req.path}.html`, res);
});

app.get("/sitemap.xml", async (_: Request, res: Response) => {
  try {
    const sitemap = await generateSitemapDynamic();
    res.header("Content-Type", "application/xml");
    res.send(sitemap);
  } catch (error) {
    console.error("Error generating sitemap:", error);
    res.status(500).send("Error generating sitemap");
  }
});

app.use(async (_: Request, res: Response) => {
  await sendHtml("/404.html", res);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
