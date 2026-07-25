// @ts-check
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import markdownItAnchor from "markdown-it-anchor";
import { categorySlugs, categoryLabel } from "./_data/categories.js";

// Type definitions for better autocompletion in VS Code
// See: https://www.11ty.dev/docs/config/#configuration-api-methods
/**
 * @param {import("@11ty/eleventy/UserConfig").default} eleventyConfig
 */
export default function (eleventyConfig) {
  // Exclude repo docs from build
  eleventyConfig.ignores.add("AGENTS.md");
  eleventyConfig.ignores.add("plan.md");
  eleventyConfig.ignores.add("session.md");
  eleventyConfig.ignores.add("README.md");
  eleventyConfig.addPlugin(syntaxHighlight);

  // Configure markdown-it to add IDs to headings for TOC links
  eleventyConfig.amendLibrary("md", (mdLib) => {
    mdLib.use(markdownItAnchor, {
      permalink: markdownItAnchor.permalink.headerLink({
        safariReaderFix: true,
      }),
      level: [2, 3, 4, 5, 6],
      slugify: eleventyConfig.getFilter("slugify")
    });
  });
  eleventyConfig.addPassthroughCopy({ public: "./public" });

  // Exclude AGENTS.md from build
  eleventyConfig.ignores.add("AGENTS.md");

  // Copy robots.txt and manifest.xml to root
  eleventyConfig.addPassthroughCopy({ "public/robots.txt": "robots.txt" });
  eleventyConfig.addPassthroughCopy({ "public/manifest.xml": "manifest.xml" });
  eleventyConfig.addPassthroughCopy({ "public/manifest.json": "manifest.json" });

  // Exclude AGENTS.md from build
  eleventyConfig.ignores.add("AGENTS.md");

  // Default layout for Markdown files if not defined
  eleventyConfig.addGlobalData("layout", "layouts/layout.njk");
  eleventyConfig.setLayoutsDirectory("layouts");
  eleventyConfig.setTemplateFormats(["md", "njk", "html"]);
  eleventyConfig.setIncludesDirectory;
  eleventyConfig.setInputDirectory(".");

  // Make all markdown files in /articles available as a collection
  eleventyConfig.addCollection("articles", (collection) => {
    const articles = collection.getFilteredByGlob("./articles/*.md").sort((a, b) => {
      return b.date - a.date; // sort by date - descending
    });

    // Build-time guard: an article's first tag MUST be a valid category slug.
    // Fails the build loudly on typos / reordered tags / missing category.
    const valid = new Set(categorySlugs);
    const problems = [];
    for (const item of articles) {
      const tags = (item.data.tags || []).filter((t) => t !== "articles");
      const first = tags[0];
      if (!first) {
        problems.push(`${item.inputPath}: no tags (first tag must be a category)`);
      } else if (!valid.has(first)) {
        problems.push(
          `${item.inputPath}: first tag "${first}" is not a valid category slug (expected one of: ${categorySlugs.join(", ")})`,
        );
      }
    }
    if (problems.length) {
      throw new Error(
        "Article category guard failed — tags[0] must be a category slug:\n  " +
          problems.join("\n  "),
      );
    }

    return articles;
  });

  // Category of an article = its first tag. Filter: slug -> human label.
  eleventyConfig.addFilter("categoryLabel", (slug) => categoryLabel[slug] || slug);

  // Given an article's tags, return the category slug (first tag).
  eleventyConfig.addFilter("categoryOf", (tags) => {
    const t = (tags || []).filter((x) => x !== "articles");
    return t[0];
  });

  // Given an article's tags, return only the topic tags (everything after the category).
  eleventyConfig.addFilter("topicTags", (tags) => {
    const t = (tags || []).filter((x) => x !== "articles");
    return t.slice(1);
  });

  // Add a custom date filter
  eleventyConfig.addFilter("date", (dateObj) => {
    const date = new Date(dateObj);

    // You can add more formatting options here if needed
    return date.toLocaleDateString("en-US");
  });

  eleventyConfig.addFilter("isPast", (dateStr) => {
    return new Date(dateStr) < new Date();
  });

  // ISO 8601 date for structured data / OG article tags.
  eleventyConfig.addFilter("isoDate", (dateObj) => {
    return new Date(dateObj).toISOString();
  });

  eleventyConfig.addFilter("year", () => {
    return new Date().getFullYear().toString();
  });

  return {
    dir: {
      output: "dist"
    }
  };
}
