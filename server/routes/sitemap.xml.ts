export default defineEventHandler(async (event) => {
  const hostname = "https://www.knowhowcode.dev";

  // Get all articles from the content directory
  const { serverQueryContent } = await import("#content/server");
  const articles = await serverQueryContent(event)
    .where({ _path: { $regex: /^\/articles\// } })
    .find();

  const urls = [
    {
      loc: hostname,
      changefreq: "weekly",
      priority: 1.0,
      lastmod: new Date().toISOString().split("T")[0],
    },
    {
      loc: `${hostname}/articles`,
      changefreq: "weekly",
      priority: 0.8,
      lastmod: new Date().toISOString().split("T")[0],
    },
    {
      loc: `${hostname}/trainings`,
      changefreq: "monthly",
      priority: 0.6,
      lastmod: new Date().toISOString().split("T")[0],
    },
    {
      loc: `${hostname}/talks`,
      changefreq: "monthly",
      priority: 0.6,
      lastmod: new Date().toISOString().split("T")[0],
    },
  ];

  // Add all articles
  articles.forEach((article: any) => {
    if (article._path) {
      urls.push({
        loc: `${hostname}${article._path}`,
        changefreq: "monthly",
        priority: 0.7,
        lastmod: article.date
          ? new Date(article.date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
      });
    }
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
    <lastmod>${url.lastmod}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>`;

  setHeader(event, "Content-Type", "application/xml");
  return sitemap;
});
