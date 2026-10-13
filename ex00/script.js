"use strict";

(() => {
  const root = document.documentElement;          // the <html> element
  const STORAGE_KEY = "portfolio-preferences";

  /* ---------- Small helpers ---------- */

  // localStorage can be blocked (private mode), so never let it crash the page.
  const loadPrefs = () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  };
  const savePrefs = (prefs) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      /* ignore: preferences just won't persist */
    }
  };

  const prefs = loadPrefs();

  /* ---------- 1. Theme switcher (mandatory feature) ---------- */
  const themeButton = document.getElementById("theme-toggle");
  const themeLabel = document.getElementById("theme-toggle-label");

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);                        // DOM mutation
    const isDark = theme === "dark";
    themeButton.setAttribute("aria-pressed", String(isDark));
    themeLabel.textContent = isDark ? "Light mode" : "Dark mode";  // text mutation
  }

  // Callback: runs every time the button is clicked (step 3)
  function handleThemeClick() {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    prefs.theme = next;
    savePrefs(prefs);
  }

  // Register the listener: "when a click happens on this button, call that function"
  themeButton.addEventListener("click", handleThemeClick);

  /* ---------- Restore saved preferences, else follow the OS ---------- */
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(prefs.theme || (prefersDark ? "dark" : "light"));

  /* ---------- 3. Mobile menu ---------- */
  const menuButton = document.getElementById("menu-toggle");
  const nav = document.getElementById("site-nav");

  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  menuButton.addEventListener("click", () => {
    setMenu(!nav.classList.contains("is-open"));
  });

  // Close the menu after choosing a link (event delegation: one listener on <nav>)
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenu(false);
  });

  // Close with the Escape key
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
  });

  /* ---------- 4. Highlight the nav link of the visible section ---------- */
  const navLinks = document.querySelectorAll(".nav-list a");
  const sections = document.querySelectorAll("main section[id]");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) => {
            link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
          });
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((section) => observer.observe(section));
  }

  /* ---------- 5. Contact form validation ---------- */
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const rules = {
    name: (value) => (value.trim().length >= 2 ? "" : "Enter your name (at least 2 characters)."),
    email: (value) => (emailPattern.test(value.trim()) ? "" : "Enter a valid email, like name@example.com."),
    message: (value) => (value.trim().length >= 10 ? "" : "Write a message of at least 10 characters."),
  };

  function validateField(field) {
    const message = rules[field.name](field.value);
    document.getElementById(`${field.id}-error`).textContent = message;
    field.closest(".field").classList.toggle("has-error", message !== "");
    field.setAttribute("aria-invalid", String(message !== ""));
    return message === "";
  }

  const fields = [...form.querySelectorAll("input, textarea")];

  // Validate when leaving a field; re-validate while typing only after an error was shown
  fields.forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      status.textContent = "";            // hide the old "Message sent" text once the user types again
      if (field.getAttribute("aria-invalid") === "true") validateField(field);
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();                 // stop the browser reloading the page
    status.textContent = "";

    const results = fields.map(validateField);
    const firstInvalid = fields.find((_, i) => !results[i]);

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    // No backend in this exercise: confirm to the user and reset the form.
    status.textContent = "Message sent. Thank you, I'll reply soon.";
    form.reset();
    fields.forEach((f) => f.removeAttribute("aria-invalid"));
  });

  /* ---------- 6. Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
