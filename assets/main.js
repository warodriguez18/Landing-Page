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
    document.querySelector('meta[name="theme-color"]').content = dark ? "#0e1118" : "#183b66";
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

  const { gsap, ScrollTrigger } = window;
  if (!gsap || !ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();
  media.add({
    motion: "(prefers-reduced-motion: no-preference)",
    desktop: "(min-width: 900px) and (min-height: 660px) and (pointer: fine)",
  }, ({ conditions }) => {
    if (!conditions.motion) return;

    if (conditions.desktop) {
      gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 0.35,
        },
      })
        .to(".hero-photo img", { yPercent: 4, scale: 1.035 }, 0)
        .to(".hero-copy", { y: -24 }, 0)
        .to(".hero-scene figcaption", { y: -40 }, 0);
    }

    const revealHeading = (heading) => gsap.from(heading, {
      y: 14,
      opacity: 0.65,
      duration: 0.42,
      ease: "power2.out",
      scrollTrigger: { trigger: heading, start: "top 92%", once: true },
    });
    revealHeading(document.getElementById("about-title"));

    const stage = document.querySelector(".project-stage");
    if (conditions.desktop) {
      const track = stage.querySelector(".project-track");
      const travel = () => track.scrollWidth - stage.clientWidth;
      stage.classList.add("is-cinematic");
      gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: stage,
          start: "center center",
          end: () => "+=" + Math.round(travel() * 0.64 + window.innerHeight * 0.38),
          pin: true,
          anticipatePin: 1,
          scrub: 0.35,
          invalidateOnRefresh: true,
        },
      })
        .fromTo(".order-visual .flow-node", { opacity: 0.7, y: 8 }, {
          opacity: 1, y: 0, duration: 0.2, stagger: 0.09,
        }, 0)
        .fromTo(".order-visual .flow-edge", { scaleX: 0 }, {
          scaleX: 1, duration: 0.13, stagger: 0.09,
        }, 0.08)
        .to(track, { x: () => -travel(), duration: 1.25 }, 0.44);
    }

    gsap.utils.toArray("#experiencia h2, #competencias h2, #contacto h2").forEach(revealHeading);

    const refresh = gsap.delayedCall(0.12, () => ScrollTrigger.refresh()).pause();
    const scheduleRefresh = (event) => {
      if (event.target.tagName === "DETAILS") refresh.restart(true);
    };
    document.addEventListener("toggle", scheduleRefresh, true);

    return () => {
      stage.classList.remove("is-cinematic");
      document.removeEventListener("toggle", scheduleRefresh, true);
    };
  });
})();
