// Newsletter form handler (nav + footer forms). Initialized on demand.
export function initNewsletterForms() {
  initNewsletterForm(
    "newsletter-form",
    "newsletter-email",
    "newsletter-tooltip",
    "newsletter-tooltip-content",
  );
  initNewsletterForm(
    "nav-newsletter-form",
    "nav-newsletter-email",
    "nav-newsletter-tooltip",
    "nav-newsletter-tooltip-content",
  );
}

function initNewsletterForm(formId, emailId, tooltipId, tooltipContentId) {
  const form = document.getElementById(formId);
  const emailInput = document.getElementById(emailId);
  const tooltip = document.getElementById(tooltipId);
  const tooltipContent = document.getElementById(tooltipContentId);

  if (form && emailInput && tooltip && tooltipContent) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = emailInput.value.trim();
      const submitButton = form.querySelector('button[type="submit"]');

      if (!email) {
        showTooltip(tooltip, tooltipContent, "Please enter your email address", "error");
        return;
      }

      submitButton.disabled = true;
      emailInput.disabled = true;

      try {
        const response = await fetch("/api/newsletter", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          showTooltip(
            tooltip,
            tooltipContent,
            data.message || "Successfully subscribed!",
            "success",
          );
          emailInput.value = "";
        } else {
          showTooltip(
            tooltip,
            tooltipContent,
            data.error || "Failed to subscribe. Please try again.",
            "error",
          );
        }
      } catch (error) {
        console.error("Newsletter subscription error:", error);
        showTooltip(tooltip, tooltipContent, "An error occurred. Please try again later.", "error");
      } finally {
        submitButton.disabled = false;
        emailInput.disabled = false;
      }
    });
  }
}

function showTooltip(tooltip, tooltipContent, message, type) {
  tooltipContent.textContent = message;

  if (type === "success") {
    tooltip.setAttribute("variant", "success");
  } else if (type === "error") {
    tooltip.setAttribute("variant", "danger");
  } else {
    tooltip.setAttribute("variant", "neutral");
  }

  tooltip.show();

  setTimeout(() => {
    tooltip.hide();
  }, 3000);
}
