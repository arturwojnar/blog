import fs from "fs/promises";
import path from "path";
import { __dirname } from "./consts.js";

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
}

// Domain configurations
const DOMAINS = {
  knowhowcode: "https://www.knowhowcode.dev",
  arturwojnar: "https://www.arturwojnar.dev",
} as const;

type DomainKey = keyof typeof DOMAINS;

// Static pages configuration
const STATIC_PAGES: PageConfig[] = [
  { url: "/", priority: "1.0", changefreq: "weekly" },
  { url: "/articles", priority: "0.9", changefreq: "weekly" },
  { url: "/talks", priority: "0.7", changefreq: "monthly" },
  { url: "/trainings", priority: "0.7", changefreq: "monthly" },
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
  const articlesDir = path.join(__dirname, "../articles");
  const files = await fs.readdir(articlesDir);
  const mdFiles = files.filter((file) => file.endsWith(".md"));

  const articles: Article[] = [];

  for (const file of mdFiles) {
    try {
      const filePath = path.join(articlesDir, file);
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
 * Main function to generate and save sitemaps for all domains
 */
export async function generateSitemap(): Promise<void> {
  const articles = await getArticles();

  // Generate sitemap for each domain
  for (const [domainKey, domainUrl] of Object.entries(DOMAINS)) {
    const xml = generateSitemapXML(articles, STATIC_PAGES, domainUrl);

    // Save to public directory with domain-specific filename for reference
    const publicOutputPath = path.join(__dirname, `../public/sitemap-${domainKey}.xml`);
    await fs.writeFile(publicOutputPath, xml, "utf-8");

    console.log(`✅ Sitemap generated for ${domainUrl} with ${articles.length} articles at ${publicOutputPath}`);
  }

  // Also save the primary domain sitemap as sitemap.xml in dist root
  const primaryXml = generateSitemapXML(articles, STATIC_PAGES, DOMAINS.knowhowcode);
  const rootOutputPath = path.join(__dirname, `../dist/sitemap.xml`);

  // Ensure dist directory exists
  const distDir = path.join(__dirname, `../dist`);
  await fs.mkdir(distDir, { recursive: true });

  await fs.writeFile(rootOutputPath, primaryXml, "utf-8");

  console.log(`✅ Primary sitemap copied to ${rootOutputPath}`);
}

/**
 * Generate sitemap dynamically (for server routes)
 */
export async function generateSitemapDynamic(domain: DomainKey = "knowhowcode"): Promise<string> {
  const articles = await getArticles();
  const baseUrl = DOMAINS[domain];
  return generateSitemapXML(articles, STATIC_PAGES, baseUrl);
}
