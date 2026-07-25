// Entry point. Loads component modules ON DEMAND — only when the matching
// custom element actually exists on the page. This code-splits the bundle so a
// page that has no <big-number>/<like-container> never downloads that JS.
//
// Native browser ES module dynamic import() = one network chunk per module,
// cached independently. No bundler needed.

const load = (selector, importer) => {
  if (document.querySelector(selector)) {
    importer().catch((err) => console.error(`Failed to load ${selector}:`, err));
  }
};

// article-image appears on nearly every article → load if present.
load("article-image", () => import("./components/article-image.js"));

// like-container only on article pages.
load("like-container", () => import("./components/like-container.js"));

// big-number is rare → only fetched on the one page that uses it.
load("big-number", () => import("./components/big-number.js"));

// Theme toggle lives in the shared header.
if (document.getElementById("theme-toggle")) {
  import("./theme-toggle.js")
    .then((m) => m.initThemeToggle())
    .catch((err) => console.error("Failed to load theme-toggle:", err));
}

// Mobile hamburger nav toggle.
const navToggle = document.getElementById("nav-toggle");
const siteNav = document.getElementById("site-nav");
if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const open = siteNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
  });

  // Close the menu when a link is tapped.
  siteNav.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      siteNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

// Newsletter forms live in the shared footer/nav. Load if a form is present.
if (document.getElementById("newsletter-form") || document.getElementById("nav-newsletter-form")) {
  import("./newsletter.js")
    .then((m) => {
      const run = () => m.initNewsletterForms();
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", run, { once: true });
      } else {
        run();
      }
    })
    .catch((err) => console.error("Failed to load newsletter:", err));
}
