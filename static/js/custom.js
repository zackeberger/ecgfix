/*
 * custom.js
 *
 * Behavior used by this page only:
 * 1) accessibility-friendly focus handling for icon/name clicks,
 * 2) author avatar fallbacks,
 * 3) BibTeX copy button,
 * 4) unreleased-code toast.
 */

(function () {
  const COPY_RESET_DELAY_MS = 1200;
  const TOAST_HIDE_DELAY_MS = 1600;
  const copyResetTimers = new WeakMap();
  let toastHideTimer = null;

  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
      return;
    }
    callback();
  }

  function isPointerClick(event) {
    return typeof event.detail === "number" && event.detail > 0;
  }

  function blurAfterPointerClick(selector) {
    document.querySelectorAll(selector).forEach((element) => {
      element.addEventListener("click", (event) => {
        if (isPointerClick(event)) {
          element.blur();
        }
      });
    });
  }

  function initAvatarFallbacks() {
    document.querySelectorAll(".author-avatar-img").forEach((image) => {
      const avatar = image.closest(".author-avatar");
      if (!avatar) return;

      const fallback = avatar.querySelector(".author-avatar-fallback");
      if (fallback && image.dataset.initials) {
        fallback.textContent = image.dataset.initials;
      }

      image.addEventListener("error", () => avatar.classList.add("avatar-missing"));
      image.addEventListener("load", () => avatar.classList.remove("avatar-missing"));
    });
  }

  async function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }

  function setCopyButtonState(button, copied) {
    const label = button.querySelector(".copy-text");
    const defaultLabel = button.dataset.defaultLabel || (label ? label.textContent.trim() : "Copy");
    button.dataset.defaultLabel = defaultLabel;

    if (label) {
      label.textContent = copied ? "Copied" : defaultLabel;
    }

    button.classList.toggle("is-copied", copied);
  }

  function initBibtexCopy() {
    document.querySelectorAll(".copy-bibtex-btn").forEach((button) => {
      button.addEventListener("click", async () => {
        const targetId = button.getAttribute("data-copy-target");
        const target = targetId ? document.getElementById(targetId) : null;
        if (!target) return;

        try {
          await copyText(target.innerText || target.textContent || "");
          setCopyButtonState(button, true);

          const existing = copyResetTimers.get(button);
          if (existing) {
            window.clearTimeout(existing);
          }

          const timer = window.setTimeout(() => setCopyButtonState(button, false), COPY_RESET_DELAY_MS);
          copyResetTimers.set(button, timer);
        } catch (_error) {
          // No-op: failures are non-critical UI behavior.
        }
      });
    });
  }

  function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    if (toastHideTimer) {
      window.clearTimeout(toastHideTimer);
    }

    toastHideTimer = window.setTimeout(() => {
      toast.classList.remove("show");
    }, TOAST_HIDE_DELAY_MS);
  }

  function initUnreleasedCodeToast() {
    document.querySelectorAll(".code-unreleased").forEach((element) => {
      const message = element.getAttribute("data-toast") || "Code will be released upon publication";

      element.addEventListener("click", (event) => {
        event.preventDefault();
        showToast(message);
        element.blur();
      });

      element.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          showToast(message);
        }
      });
    });
  }

  onReady(() => {
    blurAfterPointerClick(".name-link, .icon-btn");
    initAvatarFallbacks();
    initBibtexCopy();
    initUnreleasedCodeToast();
  });
})();
