class ArticleImage extends HTMLElement {
  connectedCallback() {
    const src = this.getAttribute("src");
    const alt = this.getAttribute("alt") || this.getAttribute("label") || "";
    const loading = this.getAttribute("loading") || "lazy";
    const isThumbnail = this.getAttribute("thumbnail") === 'true';
    const label = this.getAttribute("label") || '';
    const maxWidth = this.getAttribute("maxwidth") || '100%';

    // Create container with spinner
    this.innerHTML = isThumbnail ? `
      <div class="article-thumbnail-container">
        <sl-spinner class="article-image-spinner"></sl-spinner>
        <img class="article-image-img" alt="${alt}" loading="${loading}" style="max-width: ${maxWidth};" />
      </div>
    ` : `
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
    a.href = src;

    // Check if image loaded synchronously (cached)
    setTimeout(() => {
      if (img.complete && img.naturalHeight !== 0 && !loaded) {
        hideSpinner();
      }
    }, 0);
  }
}

customElements.define("article-image", ArticleImage);

class LikeContainer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.likes = 0;
    this.hearts = [];
    this.nextHeartId = 0;
  }

  connectedCallback() {
    const slug = this.getAttribute('slug');
    if (!slug) {
      console.error('like-container: slug attribute is required');
      return;
    }

    this.render();
    this.fetchLikes(slug);
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: relative;
        }

        .like-container {
          position: relative;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .back-link {
          text-decoration: none;
          color: inherit;
          font-size: 16px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .back-link:hover {
          opacity: 0.7;
        }

        .like-button {
          background: transparent;
          border: none;
          color: inherit;
          padding: 12px 24px;
          padding-left: 0;
          font-size: 1.5em;
          font-weight: 600;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          user-select: none;
        }

        .like-button:hover {
          transform: scale(1.1);
        }

        .like-button:active {
          transform: scale(0.95);
        }

        .like-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        #likeCount:empty {
          display: none;
        }

        #likeCount:empty::before {
          content: none;
        }

        .hearts-container {
          position: absolute;
          top: 50%;
          left: 60px;
          transform: translateY(-50%);
          width: 100px;
          height: 200px;
          pointer-events: none;
          overflow: visible;
          z-index: 1000;
        }

        .floating-heart {
          position: absolute;
          bottom: 0;
          left: 0;
          font-size: 24px;
          animation: float-up linear forwards;
          pointer-events: none;
          opacity: 1;
          z-index: 9999999;
        }

        @keyframes float-up {
          0% {
            transform: translateY(0) translateX(0) scale(0.5);
            opacity: 1;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(-200px) translateX(0) scale(1.2);
            opacity: 0;
          }
        }
      </style>

      <div class="like-container">
        <a href="/articles" class="back-link">← Back</a>
        <button class="like-button" id="likeBtn">
          ❤️ <span id="likeCount"></span>
        </button>
        <div class="hearts-container" id="heartsContainer"></div>
      </div>
    `;

    const button = this.shadowRoot.getElementById('likeBtn');
    button.addEventListener('click', () => this.handleLike());
  }

  async fetchLikes(slug) {
    try {
      const response = await fetch(`/api/likes?article=${slug}`);
      const data = await response.json();
      this.likes = data.likes || 0;
      this.updateLikesDisplay();
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  }

  async handleLike() {
    const slug = this.getAttribute('slug');
    const button = this.shadowRoot.getElementById('likeBtn');

    // Disable button temporarily
    button.disabled = true;

    try {
      const response = await fetch(`/api/likes?article=${slug}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      this.likes = data.likes;
      this.updateLikesDisplay();

      // Add multiple hearts for a nicer effect
      for (let i = 0; i < 3; i++) {
        setTimeout(() => this.addFloatingHeart(), i * 100);
      }
    } catch (error) {
      console.error('Error liking article:', error);
    } finally {
      // Re-enable button after a short delay
      setTimeout(() => {
        button.disabled = false;
      }, 500);
    }
  }

  addFloatingHeart() {
    const id = this.nextHeartId++;
    const container = this.shadowRoot.getElementById('heartsContainer');

    // Randomize position and animation duration
    const x = Math.floor(Math.random() * 40) - 20; // -20px to +20px
    const duration = 1.5 + Math.random() * 1; // 1.5s to 2.5s

    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = '❤️';
    heart.style.left = `${x}px`;
    heart.style.animationDuration = `${duration}s`;

    container.appendChild(heart);

    // Remove heart after animation completes
    setTimeout(() => {
      heart.remove();
    }, duration * 1000);
  }

  updateLikesDisplay() {
    const likeCount = this.shadowRoot.getElementById('likeCount');
    if (likeCount) {
      likeCount.textContent = this.likes;
    }
  }
}

customElements.define("like-container", LikeContainer);

class BigNumber extends HTMLElement {
  connectedCallback() {
    const value = this.getAttribute("value") || "0";
    
    // Map of digit to emoji
    const digitEmoji = {
      '0': '0️⃣',
      '1': '1️⃣',
      '2': '2️⃣',
      '3': '3️⃣',
      '4': '4️⃣',
      '5': '5️⃣',
      '6': '6️⃣',
      '7': '7️⃣',
      '8': '8️⃣',
      '9': '9️⃣'
    };
    
    // Convert each digit to emoji
    const emojiNumber = value.split('').map(digit => digitEmoji[digit] || digit).join('');
    
    this.innerHTML = `<span style="font-size: 1.5em">${emojiNumber}</span>`;
  }
}

customElements.define("big-number", BigNumber);

// Newsletter Form Handler
document.addEventListener('DOMContentLoaded', () => {
  // Handle both footer and nav newsletter forms
  initNewsletterForm('newsletter-form', 'newsletter-email', 'newsletter-tooltip', 'newsletter-tooltip-content');
  initNewsletterForm('nav-newsletter-form', 'nav-newsletter-email', 'nav-newsletter-tooltip', 'nav-newsletter-tooltip-content');

  function initNewsletterForm(formId, emailId, tooltipId, tooltipContentId) {
    const form = document.getElementById(formId);
    const emailInput = document.getElementById(emailId);
    const tooltip = document.getElementById(tooltipId);
    const tooltipContent = document.getElementById(tooltipContentId);

    if (form && emailInput && tooltip && tooltipContent) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const submitButton = form.querySelector('button[type="submit"]');

        if (!email) {
          showTooltip(tooltip, tooltipContent, 'Please enter your email address', 'error');
          return;
        }

        // Disable form during submission
        submitButton.disabled = true;
        emailInput.disabled = true;

        try {
          const response = await fetch('/api/newsletter', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
          });

          const data = await response.json();

          if (response.ok && data.success) {
            showTooltip(tooltip, tooltipContent, data.message || 'Successfully subscribed!', 'success');
            emailInput.value = ''; // Clear the input
          } else {
            showTooltip(tooltip, tooltipContent, data.error || 'Failed to subscribe. Please try again.', 'error');
          }
        } catch (error) {
          console.error('Newsletter subscription error:', error);
          showTooltip(tooltip, tooltipContent, 'An error occurred. Please try again later.', 'error');
        } finally {
          // Re-enable form
          submitButton.disabled = false;
          emailInput.disabled = false;
        }
      });
    }
  }

  function showTooltip(tooltip, tooltipContent, message, type) {
    // Set content
    tooltipContent.textContent = message;
    
    // Set variant based on type
    if (type === 'success') {
      tooltip.setAttribute('variant', 'success');
    } else if (type === 'error') {
      tooltip.setAttribute('variant', 'danger');
    } else {
      tooltip.setAttribute('variant', 'neutral');
    }
    
    // Show tooltip
    tooltip.show();
    
    // Hide after 3 seconds
    setTimeout(() => {
      tooltip.hide();
    }, 3000);
  }
});
