// Theme toggle button. Flips <html> data-theme + Shoelace .sl-theme-dark,
// persists to localStorage. The initial theme is set by an inline no-flash
// script in <head>; this only handles user clicks + reflecting current state.
export function initThemeToggle() {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;

  const root = document.documentElement;

  const current = () => root.getAttribute("data-theme") || "light";

  const apply = (theme) => {
    root.setAttribute("data-theme", theme);
    root.classList.toggle("sl-theme-dark", theme === "dark");
    try {
      localStorage.setItem("theme", theme);
    } catch {
      /* ignore */
    }
    reflect(theme);
  };

  const reflect = (theme) => {
    const isDark = theme === "dark";
    btn.setAttribute("aria-pressed", String(isDark));
    btn.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
    btn.textContent = isDark ? "☀" : "☾";
  };

  reflect(current());
  btn.addEventListener("click", () => {
    apply(current() === "dark" ? "light" : "dark");
  });
}
