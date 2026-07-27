// Article category taxonomy — single source of truth.
//
// Convention: an article's FIRST tag (tags[0]) is its category slug and MUST be
// one of the slugs below. Remaining tags are freeform topic tags. A build-time
// guard in eleventy.config.js asserts this and fails the build otherwise.
//
// Consumed by templates for the Articles category filter and per-article badge.

export const categories = [
  {
    slug: "architecture",
    label: "Architecture",
    description:
      "System structure, coupling, monoliths vs. microservices, patterns and anti-patterns.",
  },
  {
    slug: "domain-design",
    label: "Domain & Design",
    description:
      "DDD, event sourcing, modeling, archetypes and product discovery.",
  },
  {
    slug: "product-delivery",
    label: "Product & Delivery",
    description:
      "Shipping mature products: MVPs, quality, SDLC, risk and delivery.",
  },
  {
    slug: "engineering-craft",
    label: "Engineering Craft",
    description:
      "Code-level craft: TypeScript, ORMs, DTOs, patterns in practice.",
  },
  {
    slug: "cloud-distributed",
    label: "Cloud & Distributed",
    description:
      "AWS, distributed systems, modernization and reliable messaging.",
  },
  {
    slug: "people-communication",
    label: "People & Communication",
    description:
      "Soft skills, teams, collaboration and communication — the human side of architecture.",
  },
];

// Convenience lookups
export const categorySlugs = categories.map((c) => c.slug);
export const categoryLabel = Object.fromEntries(
  categories.map((c) => [c.slug, c.label]),
);

export default categories;
