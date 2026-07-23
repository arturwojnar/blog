// <big-number value="2"> — renders digits as emoji.
export class BigNumber extends HTMLElement {
  connectedCallback() {
    const value = this.getAttribute("value") || "0";

    const digitEmoji = {
      0: "0️⃣",
      1: "1️⃣",
      2: "2️⃣",
      3: "3️⃣",
      4: "4️⃣",
      5: "5️⃣",
      6: "6️⃣",
      7: "7️⃣",
      8: "8️⃣",
      9: "9️⃣",
    };

    const emojiNumber = value
      .split("")
      .map((digit) => digitEmoji[digit] || digit)
      .join("");

    this.innerHTML = `<span style="font-size: 1.5em">${emojiNumber}</span>`;
  }
}

customElements.define("big-number", BigNumber);
