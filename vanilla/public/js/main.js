class ArticleImage extends HTMLElement {
  connectedCallback() {
    const src = this.getAttribute("src");
    const alt = this.getAttribute("alt") || "";
    const loading = this.getAttribute("loading") || "lazy";

    // Create container with spinner
    this.innerHTML = `
      <div class="article-image-container">
        <sl-spinner class="article-image-spinner"></sl-spinner>
        <img class="article-image-img" alt="${alt}" loading="${loading}" />
      </div>
    `;

    const img = this.querySelector("img");
    const spinner = this.querySelector("sl-spinner");
    const container = this.querySelector(".article-image-container");

    let loaded = false;

    const hideSpinner = () => {
      if (loaded) return;
      loaded = true;
      spinner.style.display = "none";
      img.classList.add("loaded");
      container.classList.add("loaded");
    };

    const showError = () => {
      spinner.style.display = "none";
      container.innerHTML = `<p style="color: red;">Failed to load image</p>`;
    };

    img.addEventListener("load", hideSpinner);
    img.addEventListener("error", showError);

    // Set src after adding listeners
    img.src = src;

    // Check if image loaded synchronously (cached)
    setTimeout(() => {
      if (img.complete && img.naturalHeight !== 0 && !loaded) {
        hideSpinner();
      }
    }, 0);
  }
}

customElements.define("article-image", ArticleImage);
