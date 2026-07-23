// <like-container slug="..."> — like button with floating hearts, backed by /api/likes.
export class LikeContainer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.likes = 0;
    this.hearts = [];
    this.nextHeartId = 0;
  }

  connectedCallback() {
    const slug = this.getAttribute("slug");
    if (!slug) {
      console.error("like-container: slug attribute is required");
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

    const button = this.shadowRoot.getElementById("likeBtn");
    button.addEventListener("click", () => this.handleLike());
  }

  async fetchLikes(slug) {
    try {
      const response = await fetch(`/api/likes?article=${slug}`);
      const data = await response.json();
      this.likes = data.likes || 0;
      this.updateLikesDisplay();
    } catch (error) {
      console.error("Error fetching likes:", error);
    }
  }

  async handleLike() {
    const slug = this.getAttribute("slug");
    const button = this.shadowRoot.getElementById("likeBtn");

    button.disabled = true;

    try {
      const response = await fetch(`/api/likes?article=${slug}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      this.likes = data.likes;
      this.updateLikesDisplay();

      for (let i = 0; i < 3; i++) {
        setTimeout(() => this.addFloatingHeart(), i * 100);
      }
    } catch (error) {
      console.error("Error liking article:", error);
    } finally {
      setTimeout(() => {
        button.disabled = false;
      }, 500);
    }
  }

  addFloatingHeart() {
    this.nextHeartId++;
    const container = this.shadowRoot.getElementById("heartsContainer");

    const x = Math.floor(Math.random() * 40) - 20;
    const duration = 1.5 + Math.random() * 1;

    const heart = document.createElement("div");
    heart.className = "floating-heart";
    heart.textContent = "❤️";
    heart.style.left = `${x}px`;
    heart.style.animationDuration = `${duration}s`;

    container.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, duration * 1000);
  }

  updateLikesDisplay() {
    const likeCount = this.shadowRoot.getElementById("likeCount");
    if (likeCount) {
      likeCount.textContent = this.likes;
    }
  }
}

customElements.define("like-container", LikeContainer);
