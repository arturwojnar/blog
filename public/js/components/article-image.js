// <article-image> — lazy-loading image with spinner + error state.
// Lazy loading via native loading="lazy" is preserved (default).
export class ArticleImage extends HTMLElement {
  connectedCallback() {
    const src = this.getAttribute("src");
    const alt = this.getAttribute("alt") || this.getAttribute("label") || "";
    const loading = this.getAttribute("loading") || "lazy";
    const isThumbnail = this.getAttribute("thumbnail") === "true";
    const label = this.getAttribute("label") || "";
    const maxWidthAttr = this.getAttribute("maxwidth");
    // Clamp to the container: never exceed 100% even if maxwidth is larger.
    const maxWidth = maxWidthAttr ? `min(${maxWidthAttr}, 100%)` : "100%";

    // Create container with spinner
    this.innerHTML = isThumbnail
      ? `
      <div class="article-thumbnail-container">
        <sl-spinner class="article-image-spinner"></sl-spinner>
        <img class="article-image-img" alt="${alt}" loading="${loading}" style="max-width: ${maxWidth};" />
      </div>
    `
      : `
      <p class="article-image-container">
        <sl-spinner class="article-image-spinner"></sl-spinner>
        <a href="" target="_blank"><img class="article-image" alt="${alt}" loading="${loading}" style="max-width: ${maxWidth};" /></a>
        <em class="image-description">${label}</em>
      </p>
    `;

    const img = this.querySelector("img");
    const a = this.querySelector("a");
    const spinner = this.querySelector("sl-spinner");
    const container = this.querySelector(".article-thumbnail-container");

    let loaded = false;

    const hideSpinner = () => {
      if (loaded) return;
      loaded = true;
      spinner.style.display = "none";
      img.classList.add("loaded");
      if (container) {
        container.classList.add("loaded");
      }
    };

    const showError = () => {
      spinner.style.display = "none";
      container.innerHTML = `<p style="color: red;">Failed to load image</p>`;
    };

    img.addEventListener("load", hideSpinner);
    img.addEventListener("error", showError);

    // Set src after adding listeners
    img.src = src;
    if (a) a.href = src;

    // Check if image loaded synchronously (cached)
    setTimeout(() => {
      if (img.complete && img.naturalHeight !== 0 && !loaded) {
        hideSpinner();
      }
    }, 0);
  }
}

customElements.define("article-image", ArticleImage);
