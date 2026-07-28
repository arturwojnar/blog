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

// Recommendations carousel — show PAGE_SIZE at a time, cycle via prev/next.
// PAGE_SIZE adapts to viewport: 1 on mobile, 2 on tablet, 4 on desktop.
(function initRecoCarousel() {
  const carousel = document.querySelector("[data-reco-carousel]");
  if (!carousel) return;

  const cards = Array.from(carousel.querySelectorAll(".reco"));
  const total = cards.length;

  const prevBtn = carousel.querySelector(".reco-nav-prev");
  const nextBtn = carousel.querySelector(".reco-nav-next");
  const dotsEl  = carousel.querySelector(".reco-nav-dots");

  let pageSize = getPageSize();
  let pages    = Math.ceil(total / pageSize);
  let page     = 0;
  let dots     = [];

  function getPageSize() {
    if (window.innerWidth < 560) return 1;
    if (window.innerWidth < 900) return 2;
    return 4;
  }

  function buildDots() {
    dotsEl.innerHTML = "";
    dots = Array.from({ length: pages }, (_, i) => {
      const d = document.createElement("button");
      d.className = "reco-dot";
      d.setAttribute("aria-label", `Page ${i + 1}`);
      d.addEventListener("click", () => goTo(i));
      dotsEl.appendChild(d);
      return d;
    });
  }

  function render() {
    const start = page * pageSize;
    cards.forEach((c, i) => {
      c.classList.toggle("reco--hidden", i < start || i >= start + pageSize);
    });
    prevBtn.disabled = page === 0;
    // Hide nav entirely when everything fits on one page.
    carousel.querySelector(".reco-nav").style.display = pages <= 1 ? "none" : "";
    nextBtn.disabled = page === pages - 1;
    dots.forEach((d, i) => d.classList.toggle("active", i === page));
  }

  function goTo(p) {
    page = Math.max(0, Math.min(pages - 1, p));
    render();
  }

  function recalc() {
    const newSize = getPageSize();
    if (newSize === pageSize) return;
    pageSize = newSize;
    pages = Math.ceil(total / pageSize);
    page = 0;
    buildDots();
    render();
  }

  prevBtn.addEventListener("click", () => goTo(page - 1));
  nextBtn.addEventListener("click", () => goTo(page + 1));
  window.addEventListener("resize", recalc, { passive: true });

  buildDots();
  render();
}());
