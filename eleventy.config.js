// @ts-check
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";

// Type definitions for better autocompletion in VS Code
// See: https://www.11ty.dev/docs/config/#configuration-api-methods
/**
 * @param {import("@11ty/eleventy/UserConfig").default} eleventyConfig
 */
export default function (eleventyConfig) {
  // Exclude AGENTS.md from build
  eleventyConfig.ignores.add("AGENTS.md");
  
  eleventyConfig.addPlugin(syntaxHighlight);
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
    return collection.getFilteredByGlob("./articles/*.md").sort((a, b) => {
      return b.date - a.date; // sort by date - descending
    });
  });

  // Add a custom date filter
  eleventyConfig.addFilter("date", (dateObj) => {
    const date = new Date(dateObj);

    // You can add more formatting options here if needed
    return date.toLocaleDateString("en-US");
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
