import fs from "fs/promises";
import path from "path";

type Article = {
  url: string;
  lastmod: string;
  priority: string;
  changefreq: string;
}

type PageConfig = {
  url: string;
  priority: string;
  changefreq: string;
  lastmod?: string;
}

// Canonical domain for the site.
const DOMAINS = {
  planthencode: "https://www.planthencode.com",
} as const;

type DomainKey = keyof typeof DOMAINS;

const PRIMARY_DOMAIN: DomainKey = "planthencode";

// Static pages configuration
const STATIC_PAGES: PageConfig[] = [
  { url: "/", priority: "1.0", changefreq: "weekly" },
  { url: "/articles", priority: "0.9", changefreq: "weekly" },
  { url: "/offer", priority: "0.8", changefreq: "monthly" },
  { url: "/talks", priority: "0.7", changefreq: "monthly" },
  { url: "/contact", priority: "0.7", changefreq: "monthly" },
];

/**
 * Extracts frontmatter metadata from markdown file content
 */
function extractFrontmatter(content: string): Record<string, any> {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);

  if (!match) return {};

  const frontmatter: Record<string, any> = {};
  const lines = match?.[1]?.split("\n") || [];

  for (const line of lines) {
    const [key, ...valueParts] = line.split(":");
    if (key && valueParts.length > 0) {
      const value = valueParts.join(":").trim().replace(/^["']|["']$/g, "");
      frontmatter[key.trim()] = value;
    }
  }

  return frontmatter;
}

/**
 * Reads all article markdown files and extracts their metadata
 */
async function getArticles(): Promise<Article[]> {
  // Markdown sources live at the repo root /articles (not in dist).
  const dir = path.join(process.cwd(), "articles");
  const files = await fs.readdir(dir);
  const mdFiles = files.filter((file) => file.endsWith(".md"));

  const articles: Article[] = [];

  for (const file of mdFiles) {
    try {
      const filePath = path.join(dir, file);
      const content = await fs.readFile(filePath, "utf-8");
      const frontmatter = extractFrontmatter(content);

      const slug = frontmatter.slug || file.replace(".md", "");
      const date = frontmatter.date
        ? new Date(frontmatter.date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];

      articles.push({
        url: `/articles/${slug}`,
        lastmod: date!,
        priority: "0.8",
        changefreq: "monthly",
      });
    } catch (error) {
      console.error(`Error processing article ${file}:`, error);
    }
  }

  // Sort by lastmod date (newest first)
  return articles.sort(
    (a, b) => new Date(b.lastmod).getTime() - new Date(a.lastmod).getTime()
  );
}

/**
 * Generates XML sitemap content
 */
function generateSitemapXML(articles: Article[], staticPages: PageConfig[], baseUrl: string): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Add static pages
  for (const page of staticPages) {
    xml += "  <url>\n";
    xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
    if (page.lastmod) {
      xml += `    <lastmod>${page.lastmod}</lastmod>\n`;
    }
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += "  </url>\n";
  }

  // Add articles
  for (const article of articles) {
    xml += "  <url>\n";
    xml += `    <loc>${baseUrl}${article.url}</loc>\n`;
    xml += `    <lastmod>${article.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${article.changefreq}</changefreq>\n`;
    xml += `    <priority>${article.priority}</priority>\n`;
    xml += "  </url>\n";
  }

  xml += "</urlset>";

  return xml;
}

/**
 * Main function to generate and save the sitemap for the canonical domain.
 */
export async function generateSitemap(): Promise<void> {
  const articles = await getArticles();
  const baseUrl = DOMAINS[PRIMARY_DOMAIN];

  // Use the most recent article date as lastmod for the home & articles index.
  const newestArticleDate =
    articles[0]?.lastmod ?? new Date().toISOString().split("T")[0]!;

  const staticPages: PageConfig[] = STATIC_PAGES.map((page) =>
    page.url === "/" || page.url === "/articles"
      ? { ...page, lastmod: newestArticleDate }
      : page
  );

  const xml = generateSitemapXML(articles, staticPages, baseUrl);

  // Reference copy in public/
  const publicOutputPath = path.join(process.cwd(), `public/sitemap.xml`);
  await fs.writeFile(publicOutputPath, xml, "utf-8");
  console.log(`✅ Sitemap generated for ${baseUrl} with ${articles.length} articles at ${publicOutputPath}`);

  // Primary sitemap in dist root
  const distDir = path.join(process.cwd(), `dist`);
  await fs.mkdir(distDir, { recursive: true });
  const rootOutputPath = path.join(distDir, `sitemap.xml`);
  await fs.writeFile(rootOutputPath, xml, "utf-8");
  console.log(`✅ Primary sitemap copied to ${rootOutputPath}`);
}

/**
 * Generate sitemap dynamically (for server routes)
 */
export async function generateSitemapDynamic(domain: DomainKey = PRIMARY_DOMAIN): Promise<string> {
  const articles = await getArticles();
  const baseUrl = DOMAINS[domain];
  const newestArticleDate =
    articles[0]?.lastmod ?? new Date().toISOString().split("T")[0]!;
  const staticPages: PageConfig[] = STATIC_PAGES.map((page) =>
    page.url === "/" || page.url === "/articles"
      ? { ...page, lastmod: newestArticleDate }
      : page
  );
  return generateSitemapXML(articles, staticPages, baseUrl);
}
