"use strict";
function normalizeMenuText(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/ß/g, "ss")
    .trim();
}
function menuItemMatches(name, groupCategory, selectedCategory, search) {
  let text = normalizeMenuText(name);
  if (text.includes("drehspiess")) text += " doner kebap";
  const query = normalizeMenuText(search)
    .replace(/doener/g, "doner")
    .replace(/dueruem/g, "durum");
  return (
    (selectedCategory === "alle" || groupCategory === selectedCategory) &&
    text.includes(query)
  );
}
function openingStatus(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Berlin",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const part = (type) => parts.find((p) => p.type === type)?.value;
  const day = part("weekday"),
    minutes = Number(part("hour")) * 60 + Number(part("minute"));
  if (day === "Mon")
    return { open: false, text: "Montag Ruhetag · Dienstag ab 12 Uhr" };
  if (minutes >= 720 && minutes < 840)
    return { open: true, text: "Jetzt geöffnet · bis 14 Uhr" };
  if (minutes >= 1020 && minutes < 1260)
    return { open: true, text: "Jetzt geöffnet · bis 21 Uhr" };
  if (minutes < 720) return { open: false, text: "Heute ab 12 Uhr geöffnet" };
  if (minutes < 1020)
    return { open: false, text: "Ab 17 Uhr wieder für dich da" };
  return {
    open: false,
    text:
      day === "Sun"
        ? "Dienstag ab 12 Uhr wieder für dich da"
        : "Morgen ab 12 Uhr wieder für dich da",
  };
}
async function sendPreorder(url, data, fetcher = fetch, signal) {
  const response = await fetcher(url, {
    method: "POST",
    body: data,
    headers: { Accept: "application/json" },
    signal,
  });
  if (!response.ok) throw new Error("FORM_REJECTED");
  return true;
}
if (typeof module !== "undefined" && module.exports)
  module.exports = {
    normalizeMenuText,
    menuItemMatches,
    openingStatus,
    sendPreorder,
  };
if (typeof document !== "undefined") {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const scriptUrl =
    document.currentScript?.src || new URL("js/app.js", document.baseURI).href;
  const assetPath = (name) =>
    new URL("../img/optimized/" + name + ".webp", scriptUrl).href;
  const bySelector = (s) => document.querySelector(s);
  const byAll = (s) => Array.from(document.querySelectorAll(s));
  byAll("[data-year]").forEach(
    (el) => (el.textContent = String(new Date().getFullYear())),
  );
  const header = bySelector("[data-header]");
  let scrollFrame = false;
  const updateHeader = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 18);
  };
  updateHeader();
  window.addEventListener(
    "scroll",
    () => {
      if (!scrollFrame) {
        scrollFrame = true;
        requestAnimationFrame(() => {
          updateHeader();
          scrollFrame = false;
        });
      }
    },
    { passive: true },
  );
  const menuToggle = bySelector(".menu-toggle"),
    navigation = bySelector("#main-nav");
  function setMenu(open, returnFocus = false) {
    if (!menuToggle || !navigation) return;
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute(
      "aria-label",
      open ? "Menü schließen" : "Menü öffnen",
    );
    navigation.classList.toggle("is-open", open);
    if (returnFocus) menuToggle.focus();
  }
  menuToggle?.addEventListener("click", () =>
    setMenu(menuToggle.getAttribute("aria-expanded") !== "true"),
  );
  navigation
    ?.querySelectorAll("a")
    .forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navigation?.classList.contains("is-open"))
      setMenu(false, true);
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".site-header")) setMenu(false);
  });
  window.addEventListener(
    "resize",
    () => {
      if (window.innerWidth > 900) setMenu(false);
    },
    { passive: true },
  );
  if ("IntersectionObserver" in window && !reducedMotion.matches) {
    document.documentElement.classList.add("motion-ready");
    const observer = new IntersectionObserver(
      (entries, obs) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("is-pending");
            entry.target.classList.add("is-in");
            obs.unobserve(entry.target);
          }
        }),
      { threshold: 0.07, rootMargin: "0px 0px -16px 0px" },
    );
    byAll("[data-reveal]").forEach((el) => {
      el.classList.add("is-pending");
      observer.observe(el);
    });
    reducedMotion.addEventListener("change", (event) => {
      if (event.matches) {
        document.documentElement.classList.remove("motion-ready");
        byAll("[data-reveal]").forEach((el) =>
          el.classList.remove("is-pending"),
        );
        observer.disconnect();
      }
    });
  }
  function renderStatus() {
    const status = openingStatus();
    byAll("[data-opening-status]").forEach(
      (el) => (el.textContent = status.text),
    );
    byAll("[data-status-dot]").forEach((el) =>
      el.classList.toggle("is-open", status.open),
    );
  }
  if (bySelector("[data-opening-status]")) {
    renderStatus();
    setInterval(renderStatus, 60000);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) renderStatus();
    });
  }
  const dishImage = bySelector("#dish-image");
  if (dishImage) {
    const dishes = {
      doener: {
        image: "hero-kebap",
        alt: "Illustratives Motiv eines Dönerbrots",
        caption: "Döner & Dürüm · Serviervorschlag",
        anchor: "doener",
      },
      pizza: {
        image: "pizza",
        alt: "Illustratives Motiv einer frisch gebackenen Pizza",
        caption: "Pizza aus dem Ofen · Serviervorschlag",
        anchor: "pizza",
      },
      currywurst: {
        image: "currywurst",
        alt: "Currywurst mit Pommes bei Ersan’s Kebap",
        caption: "Currywurst & Pommes · Foto aus unserem Laden",
        anchor: "klassiker",
      },
    };
    let changeId = 0;
    byAll("[data-dish]").forEach((button) =>
      button.addEventListener("click", () => {
        const dish = dishes[button.dataset.dish];
        if (!dish) return;
        const id = ++changeId;
        byAll("[data-dish]").forEach((el) => {
          const active = el === button;
          el.classList.toggle("is-active", active);
          el.setAttribute("aria-pressed", String(active));
        });
        dishImage.classList.add("is-changing");
        const preloaded = new Image();
        let committed = false;
        const commit = () => {
          if (id !== changeId || committed) return;
          committed = true;
          setTimeout(
            () => {
              if (id !== changeId) return;
              dishImage.src = preloaded.src;
              dishImage.alt = dish.alt;
              bySelector("#dish-caption").textContent = dish.caption;
              const menuUrl = new URL("../html/menu.html", scriptUrl);
              menuUrl.hash = dish.anchor;
              const link = bySelector("#dish-link");
              link.href = menuUrl.href;
              link.setAttribute(
                "aria-label",
                button.querySelector("strong").textContent +
                  " in der Speisekarte ansehen",
              );
              dishImage.classList.remove("is-changing");
            },
            reducedMotion.matches ? 0 : 150,
          );
        };
        preloaded.onload = commit;
        preloaded.onerror = () => {
          if (id === changeId) dishImage.classList.remove("is-changing");
        };
        preloaded.src = assetPath(dish.image);
        if (preloaded.complete && preloaded.naturalWidth) commit();
      }),
    );
  }
  const menuSearch = bySelector("#menu-search");
  if (menuSearch) {
    const filterButtons = byAll("[data-menu-filter]"),
      groups = byAll("[data-menu-group]"),
      url = new URL(location.href);
    const available = filterButtons.map((b) => b.dataset.menuFilter);
    let selected = available.includes(url.searchParams.get("kategorie"))
      ? url.searchParams.get("kategorie")
      : "alle";
    function filterMenu(updateUrl = false) {
      let total = 0;
      for (const group of groups) {
        let matches = 0;
        group.querySelectorAll("[data-menu-item]").forEach((item) => {
          const match = menuItemMatches(
            item.dataset.search,
            group.dataset.menuGroup,
            selected,
            menuSearch.value,
          );
          item.hidden = !match;
          if (match) matches++;
        });
        group.hidden = matches === 0;
        total += matches;
      }
      filterButtons.forEach((b) =>
        b.setAttribute(
          "aria-pressed",
          String(b.dataset.menuFilter === selected),
        ),
      );
      bySelector("#menu-result-count").textContent =
        total + " " + (total === 1 ? "Eintrag" : "Gerichte & Getränke");
      bySelector(".menu-empty").hidden = total !== 0;
      bySelector(".menu-additives").hidden = total === 0;
      if (updateUrl) {
        const next = new URL(location.href);
        selected === "alle"
          ? next.searchParams.delete("kategorie")
          : next.searchParams.set("kategorie", selected);
        history.replaceState(null, "", next.pathname + next.search);
      }
    }
    filterButtons.forEach((b) =>
      b.addEventListener("click", () => {
        selected = b.dataset.menuFilter;
        filterMenu(true);
        const content = bySelector(".menu-content");
        if (content.getBoundingClientRect().top < 100)
          content.scrollIntoView({
            behavior: reducedMotion.matches ? "instant" : "smooth",
            block: "start",
          });
      }),
    );
    menuSearch.addEventListener("input", () => filterMenu());
    bySelector("[data-reset-menu]")?.addEventListener("click", () => {
      selected = "alle";
      menuSearch.value = "";
      filterMenu(true);
      menuSearch.focus({ preventScroll: true });
      bySelector(".menu-search-bar").scrollIntoView({
        behavior: reducedMotion.matches ? "instant" : "smooth",
        block: "center",
      });
    });
    filterMenu();
  }
  const slider = bySelector("[data-review-slider]");
  if (
    slider &&
    Array.isArray(window.ERSANS_REVIEWS) &&
    window.ERSANS_REVIEWS.length
  ) {
    const reviews = window.ERSANS_REVIEWS;
    let index = 0,
      change = 0;
    const content = slider.querySelector(".review-content");
    function showReview(direction) {
      index = (index + direction + reviews.length) % reviews.length;
      const id = ++change;
      content.classList.add("is-changing");
      setTimeout(
        () => {
          if (id !== change) return;
          slider.querySelector("[data-review-quote]").textContent =
            "„" + reviews[index].text + "“";
          slider.querySelector("[data-review-name]").textContent =
            reviews[index].name;
          slider.querySelector("[data-review-position]").textContent =
            String(index + 1).padStart(2, "0") +
            " / " +
            String(reviews.length).padStart(2, "0");
          content.classList.remove("is-changing");
        },
        reducedMotion.matches ? 0 : 170,
      );
    }
    slider
      .querySelector("[data-review-prev]")
      .addEventListener("click", () => showReview(-1));
    slider
      .querySelector("[data-review-next]")
      .addEventListener("click", () => showReview(1));
  }
  const form = bySelector("#preorderForm");
  if (form) {
    const submit = form.querySelector('button[type="submit"]'),
      label = submit.querySelector("span"),
      feedback = bySelector("#form-feedback"),
      message = form.elements.message;
    let submitting = false;
    const count = () => {
      bySelector("[data-message-count]").textContent = String(
        message.value.length,
      );
    };
    message.addEventListener("input", () => {
      message.setCustomValidity("");
      count();
    });
    form.elements.name.addEventListener("input", () =>
      form.elements.name.setCustomValidity(""),
    );
    count();
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (submitting) return;
      form.elements.name.setCustomValidity(
        form.elements.name.value.trim() ? "" : "Bitte gib deinen Namen ein.",
      );
      message.setCustomValidity(
        message.value.trim().length >= 10
          ? ""
          : "Bitte beschreibe deine Bestellung mit mindestens 10 Zeichen.",
      );
      if (!form.reportValidity()) return;
      submitting = true;
      submit.disabled = true;
      form.setAttribute("aria-busy", "true");
      label.textContent = "Anfrage wird übermittelt …";
      feedback.textContent = "";
      feedback.classList.remove("is-error");
      const controller = new AbortController(),
        timeout = setTimeout(() => controller.abort(), 20000);
      try {
        await sendPreorder(
          form.action,
          new FormData(form),
          window.fetch.bind(window),
          controller.signal,
        );
        form.reset();
        count();
        feedback.textContent =
          "Deine Anfrage wurde übermittelt. Bitte warte auf unsere persönliche Bestätigung – erst dann ist deine Vorbestellung angenommen.";
        feedback.focus();
      } catch (error) {
        feedback.classList.add("is-error");
        feedback.textContent =
          "Die Anfrage konnte nicht bestätigt werden. Deine Eingaben bleiben erhalten. Bitte versuche es erneut oder ruf uns unter 0151 590 78 248 an.";
        feedback.focus();
      } finally {
        clearTimeout(timeout);
        submitting = false;
        submit.disabled = false;
        form.removeAttribute("aria-busy");
        label.textContent = "Vorbestellung anfragen";
      }
    });
  }
  const mapButton = bySelector("[data-load-map]");
  mapButton?.addEventListener("click", () => {
    const iframe = document.createElement("iframe");
    iframe.title =
      "Google Maps: Ersan’s Kebap, Dr.-Martin-Luther-Straße 18, Dinkelsbühl";
    iframe.loading = "lazy";
    iframe.referrerPolicy = "no-referrer-when-downgrade";
    iframe.src =
      "https://www.google.com/maps?q=Dr%20Martin-Luther-Stra%C3%9Fe%2018%2091550%20Dinkelsb%C3%BChl&output=embed";
    iframe.setAttribute("allowfullscreen", "");
    iframe.tabIndex = 0;
    const container = bySelector("[data-map-container]");
    container.replaceChildren(iframe);
    iframe.focus();
  });
  let galleryDialog = null,
    activeGallery = [],
    galleryIndex = 0,
    returnFocus = null;
  function renderGallery() {
    const current = activeGallery[galleryIndex];
    if (!current) return;
    galleryDialog.querySelector("img").src = current.src;
    galleryDialog.querySelector("img").alt = current.alt;
    galleryDialog.querySelector("[data-dialog-caption]").textContent =
      String(galleryIndex + 1).padStart(2, "0") +
      " / " +
      String(activeGallery.length).padStart(2, "0") +
      " · " +
      current.alt;
  }
  function moveGallery(step) {
    galleryIndex =
      (galleryIndex + step + activeGallery.length) % activeGallery.length;
    renderGallery();
  }
  function createGallery() {
    const dialog = document.createElement("dialog");
    dialog.className = "gallery-dialog";
    dialog.setAttribute("aria-label", "Bilder aus unserer Geschichte");
    const close = document.createElement("button");
    close.className = "dialog-close";
    close.type = "button";
    close.textContent = "×";
    close.setAttribute("aria-label", "Galerie schließen");
    close.addEventListener("click", () => dialog.close());
    const image = document.createElement("img");
    image.className = "dialog-image";
    const footer = document.createElement("div");
    footer.className = "dialog-footer";
    const caption = document.createElement("p");
    caption.dataset.dialogCaption = "";
    caption.setAttribute("aria-live", "polite");
    const controls = document.createElement("div");
    for (const [step, label, text] of [
      [-1, "Vorheriges Bild", "←"],
      [1, "Nächstes Bild", "→"],
    ]) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = text;
      btn.setAttribute("aria-label", label);
      btn.addEventListener("click", () => moveGallery(step));
      controls.append(btn);
    }
    footer.append(caption, controls);
    dialog.append(close, image, footer);
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener("close", () => returnFocus?.focus());
    dialog.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        moveGallery(1);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        moveGallery(-1);
      }
    });
    document.body.append(dialog);
    return dialog;
  }
  byAll("[data-gallery]").forEach((button) =>
    button.addEventListener("click", () => {
      returnFocus = button;
      activeGallery = byAll("[data-gallery]")
        .filter((b) => b.dataset.gallery === button.dataset.gallery)
        .map((b) => ({
          src: b.querySelector("img").src,
          alt: b.querySelector("img").alt,
        }));
      galleryIndex = Number(button.dataset.galleryIndex) || 0;
      if (!galleryDialog) galleryDialog = createGallery();
      renderGallery();
      galleryDialog.showModal();
    }),
  );
}
