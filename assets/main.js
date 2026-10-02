(() => {
  const root = document.documentElement;
  const themeButton = document.getElementById("theme-toggle");
  const menuButton = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  const themeMedia = window.matchMedia("(prefers-color-scheme: dark)");
  let explicitTheme;
  try { explicitTheme = localStorage.getItem("portfolio-theme"); } catch {}

  function applyTheme(dark) {
    root.classList.toggle("dark", dark);
    themeButton.setAttribute("aria-pressed", String(dark));
    const label = dark ? "Activar modo claro" : "Activar modo oscuro";
    themeButton.setAttribute("aria-label", label);
    themeButton.title = label;
    document.querySelector('meta[name="theme-color"]').content = dark ? "#070b14" : "#f8fafc";
  }

  applyTheme(root.classList.contains("dark"));
  themeButton.addEventListener("click", () => {
    const dark = !root.classList.contains("dark");
    explicitTheme = dark ? "dark" : "light";
    applyTheme(dark);
    try { localStorage.setItem("portfolio-theme", explicitTheme); } catch {}
  });
  themeMedia.addEventListener("change", (event) => {
    if (explicitTheme !== "light" && explicitTheme !== "dark") applyTheme(event.matches);
  });

  function closeMenu(returnFocus = false) {
    navLinks.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Abrir menú");
    if (returnFocus) menuButton.focus();
  }
  menuButton.addEventListener("click", () => {
    const open = navLinks.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  });
  navLinks.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;
    const mobile = window.matchMedia("(max-width: 760px)").matches;
    closeMenu();
    if (mobile) {
      // Evitar dejar el foco en un enlace que acaba de ocultarse.
      const destination = document.querySelector(link.getAttribute("href"));
      destination.setAttribute("tabindex", "-1");
      destination.focus({ preventScroll: true });
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navLinks.classList.contains("is-open")) closeMenu(true);
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".navigation")) closeMenu();
  });
  window.matchMedia("(min-width: 761px)").addEventListener("change", () => closeMenu());

  document.getElementById("year").textContent = new Date().getFullYear();

  const form = document.getElementById("contact-form");
  const note = document.getElementById("form-note");
  const submitButton = document.getElementById("form-submit");
  const submitLabel = submitButton.querySelector("span");
  const fields = [form.elements.name, form.elements.email, form.elements.message];
  let sending = false;
  fields.forEach((field) => {
    field.addEventListener("input", () => field.setCustomValidity(""));
    field.addEventListener("blur", () => {
      field.setCustomValidity(field.value && !field.value.trim() ? "Este campo no puede contener solo espacios." : "");
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (sending) return;
    fields.forEach((field) => {
      field.value = field.value.trim();
      field.setCustomValidity("");
    });
    if (!form.reportValidity()) return;

    sending = true;
    submitButton.disabled = true;
    form.setAttribute("aria-busy", "true");
    submitLabel.textContent = "Enviando…";
    note.dataset.state = "pending";
    note.textContent = "Enviando tu mensaje…";
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });
      if (!response.ok) throw new Error("No se pudo enviar el formulario.");
      form.reset();
      note.dataset.state = "success";
      note.textContent = "Mensaje enviado correctamente. Gracias por escribirme.";
    } catch (error) {
      note.dataset.state = "error";
      note.textContent = error.name === "AbortError"
        ? "El envío tardó demasiado. Inténtalo de nuevo o usa el correo electrónico."
        : "No se pudo enviar el mensaje. Tus datos siguen en el formulario; puedes reintentar o usar el correo electrónico.";
    } finally {
      window.clearTimeout(timeout);
      sending = false;
      submitButton.disabled = false;
      form.setAttribute("aria-busy", "false");
      submitLabel.textContent = "Enviar mensaje";
    }
  });
})();
