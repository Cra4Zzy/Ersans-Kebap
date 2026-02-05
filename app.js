// 1) Year
document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = new Date().getFullYear();
});

// 2) Mobile nav
const burger = document.querySelector("[data-burger]");
const nav = document.querySelector("[data-nav]");
if (burger && nav) {
  burger.addEventListener("click", () => nav.classList.toggle("is-open"));
  nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => nav.classList.remove("is-open"))
  );
}

// 3) Reveal on scroll
const items = document.querySelectorAll("[data-reveal]");
if (items.length && "IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  items.forEach((el) => io.observe(el));
} else {
  // Fallback: alles sichtbar
  items.forEach((el) => el.classList.add("is-in"));
}

// 4) Subtle tilt (hero card)
const tilt = document.querySelector("[data-tilt]");
if (tilt) {
  let rect = tilt.getBoundingClientRect();
  window.addEventListener("resize", () => (rect = tilt.getBoundingClientRect()));

  tilt.addEventListener("mousemove", (e) => {
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    tilt.style.transform = `rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 6).toFixed(
      2
    )}deg) translateY(-4px)`;
  });

  tilt.addEventListener("mouseleave", () => {
    tilt.style.transform = "rotateX(0deg) rotateY(0deg) translateY(0px)";
  });
}

// 5) Formspree Submit für Vorbestellung (kein mailto, kein preventDefault)
const preorderForm = document.getElementById("preorderForm");
if (preorderForm) {
  preorderForm.addEventListener("submit", () => {
    const btn = preorderForm.querySelector('button[type="submit"]');
    if (btn) {
      btn.disabled = true;
      btn.textContent = "Wird gesendet …";
    }
  });
}

// 6) Custom Reviews Carousel (statt Trustindex) — RC Variante
(function initReviewsCarousel() {
  const root = document.getElementById("reviewsWidget");
  if (!root) return;

 const track = root.querySelector("[data-reviews-track]");
const dotsWrap = root.querySelector("[data-reviews-dots]");
const btnPrev = root.querySelector("[data-reviews-prev]");
const btnNext = root.querySelector("[data-reviews-next]");


  if (!track || !dotsWrap || !btnPrev || !btnNext) return;

  // ✅ Platzhalter-Reviews (später einfach Texte ersetzen)
  const reviews = [
    {
      name: "Nina K.",
      when: "vor 2 Wochen",
      stars: 5,
      text: "Bester Döner in Dinkelsbühl – Fleisch top, Brot frisch und super freundlich. Komme safe wieder!",
    },
    {
      name: "Murat A.",
      when: "vor 1 Monat",
      stars: 5,
      text: "Schnell, sauber, richtig lecker. Döner Teller war brutal gut – Portion stimmt komplett.",
    },
    {
      name: "Lukas S.",
      when: "vor 3 Monaten",
      stars: 4,
      text: "Sehr solide! Geschmack passt, Wartezeit okay. Würde ich weiterempfehlen.",
    },
    {
      name: "Sophie B.",
      when: "vor 5 Monaten",
      stars: 5,
      text: "Mega Service und das Essen immer konstant gut. Für mich die beste Adresse!",
    },
  ];

  // Render Cards
  track.innerHTML = reviews
    .map((r) => {
      const initials = (r.name || "?")
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((x) => (x[0] ? x[0].toUpperCase() : ""))
        .join("");
      const stars = "★".repeat(r.stars) + "☆".repeat(Math.max(0, 5 - r.stars));

      return `
      <article class="reviewCard">
        <div class="reviewTop">
          <div class="reviewPerson">
            <div class="avatar" aria-hidden="true">${initials || "★"}</div>
            <div>
              <div class="reviewName">${escapeHtml(r.name)}</div>
              <div class="reviewSub">${escapeHtml(r.when)}</div>
            </div>
          </div>
          <div class="stars" aria-label="${r.stars} von 5 Sternen">${stars}</div>
        </div>

        <p class="reviewText">${escapeHtml(r.text)}</p>

        <div class="reviewFooter">
          <span class="gBadge"><span class="gDot"></span> Google</span>
          <span class="reviewSub">Verifiziert</span>
        </div>
      </article>
    `;
    })
    .join("");

  let index = 0;

  function cardsPerView() {
    return window.matchMedia("(max-width: 980px)").matches ? 1 : 3;
  }

  function maxIndex() {
    return Math.max(0, reviews.length - cardsPerView());
  }

  function renderDots() {
    const m = maxIndex();
    dotsWrap.innerHTML = "";
    for (let i = 0; i <= m; i++) {
      const d = document.createElement("button");
      d.type = "button";
      d.className = "dot" + (i === index ? " is-active" : "");
      d.setAttribute("aria-label", `Zu Bewertung ${i + 1}`);
      d.addEventListener("click", () => {
        index = i;
        update();
      });
      dotsWrap.appendChild(d);
    }
  }

  function update() {
    const m = maxIndex();
    index = Math.min(Math.max(index, 0), m);

    const firstCard = track.querySelector(".reviewCard");
    if (!firstCard) return;

    // Gap: falls CSS gap anders ist, ziehen wir ihn aus computed styles
    const gap = parseFloat(getComputedStyle(track).gap || "14");
    const step = firstCard.getBoundingClientRect().width + gap;
    track.style.transform = `translateX(${-index * step}px)`;

    [...dotsWrap.children].forEach((el, i) =>
      el.classList.toggle("is-active", i === index)
    );
  }

  btnPrev.addEventListener("click", () => {
    index -= 1;
    update();
  });
  btnNext.addEventListener("click", () => {
    index += 1;
    update();
  });

  window.addEventListener(
    "resize",
    () => {
      renderDots();
      update();
    },
    { passive: true }
  );

  renderDots();
  update();

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
})();

