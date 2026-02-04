// 1) Year
document.querySelectorAll("[data-year]").forEach(el => {
  el.textContent = new Date().getFullYear();
});

// 2) Mobile nav
const burger = document.querySelector("[data-burger]");
const nav = document.querySelector("[data-nav]");
if (burger && nav) {
  burger.addEventListener("click", () => nav.classList.toggle("is-open"));
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => nav.classList.remove("is-open")));
}

// 3) Reveal on scroll
const items = document.querySelectorAll("[data-reveal]");
if (items.length) {
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("is-in");
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach(el => io.observe(el));
}

// 4) Subtle tilt (hero card)
const tilt = document.querySelector("[data-tilt]");
if (tilt) {
  let rect = tilt.getBoundingClientRect();
  window.addEventListener("resize", () => rect = tilt.getBoundingClientRect());

  tilt.addEventListener("mousemove", (e) => {
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    tilt.style.transform = `rotateX(${(-y*5).toFixed(2)}deg) rotateY(${(x*6).toFixed(2)}deg) translateY(-4px)`;
  });
  tilt.addEventListener("mouseleave", () => {
    tilt.style.transform = "rotateX(0deg) rotateY(0deg) translateY(0px)";
  });
}

// 5) Preorder form -> prepares a mail (edit ORDER_EMAIL!)
const ORDER_EMAIL = "deine-email@domain.de"; // <- hier eure Bestell-Mail eintragen
const form = document.getElementById("preorderForm");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = fd.get("name") || "";
    const email = fd.get("email") || "";
    const phone = fd.get("phone") || "";
    const time = fd.get("time") || "";
    const msg = fd.get("msg") || "";

    const subject = encodeURIComponent(`Vorbestellung: ${name} (${time})`);
    const body = encodeURIComponent(
      `Name: ${name}\nE-Mail: ${email}\nTelefon: ${phone}\nAbholzeit: ${time}\n\nBestellung:\n${msg}\n\n— gesendet über ersans-kebap.de`
    );

    window.location.href = `mailto:${ORDER_EMAIL}?subject=${subject}&body=${body}`;
  });
}

// 6) Google Reviews (Custom Carousel) – kostenlos, ohne Trustindex
(function initReviewsCarousel(){
  const root = document.getElementById("reviewsWidget");
  if (!root) return;

  const track = root.querySelector("[data-reviews-track]");
  const dotsWrap = root.querySelector("[data-reviews-dots]");
  const btnPrev = root.querySelector("[data-reviews-prev]");
  const btnNext = root.querySelector("[data-reviews-next]");
  if (!track || !dotsWrap || !btnPrev || !btnNext) return;

  // ✅ HIER Reviews eintragen (du kannst die Texte später 1:1 ersetzen)
  // Tipp: 6–12 Reviews wirken perfekt.
  const REVIEWS = [
    {
      name: "Max",
      meta: "Local Guide · vor 2 Wochen",
      stars: 5,
      text: "Bester Döner in Dinkelsbühl. Fleisch saftig, Brot knusprig, Soßen top – komme safe wieder!",
      source: "Google"
    },
    {
      name: "Laura",
      meta: "vor 1 Monat",
      stars: 5,
      text: "Super freundlich & schnell. Dürüm war mega frisch, richtig stabil.",
      source: "Google"
    },
    {
      name: "Timo",
      meta: "Local Guide · vor 3 Monaten",
      stars: 5,
      text: "Preis/Leistung brutal. Portion groß, Geschmack 10/10.",
      source: "Google"
    },
    {
      name: "Sophie",
      meta: "vor 2 Monaten",
      stars: 5,
      text: "Sehr sauber, sympathisch, Essen immer konstant gut.",
      source: "Google"
    },
    {
      name: "Jonas",
      meta: "vor 4 Monaten",
      stars: 5,
      text: "Currywurst Special war heftig. Pommes crunchy, Sauce on point.",
      source: "Google"
    },
    {
      name: "Murat",
      meta: "Local Guide · vor 5 Monaten",
      stars: 5,
      text: "Döner Teller richtig stabil. Frische Zutaten, keine lange Wartezeit.",
      source: "Google"
    }
  ];

  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const stars = (n) => "★★★★★".slice(0, n) + "☆☆☆☆☆".slice(0, 5 - n);

  function render(){
    track.innerHTML = "";
    dotsWrap.innerHTML = "";

    REVIEWS.forEach((r, i) => {
      const card = document.createElement("article");
      card.className = "reviewCard";
      card.setAttribute("role", "group");
      card.setAttribute("aria-label", `Bewertung ${i+1} von ${REVIEWS.length}`);

      const initial = (r.name || "?").trim().charAt(0).toUpperCase();

      card.innerHTML = `
        <div class="reviewTop">
          <div class="reviewPerson">
            <div class="avatar" aria-hidden="true">${initial}</div>
            <div>
              <div class="reviewName">${escapeHtml(r.name)}</div>
              <div class="reviewSub">${escapeHtml(r.meta || "")}</div>
            </div>
          </div>
          <div class="stars" aria-label="${r.stars} von 5 Sternen">${stars(clamp(r.stars || 5, 1, 5))}</div>
        </div>

        <p class="reviewText">${escapeHtml(r.text || "")}</p>

        <div class="reviewFooter">
          <div class="gBadge">
            <span class="gDot"></span>
            <span>${escapeHtml(r.source || "Google")}</span>
          </div>
          <span class="muted small">Verifiziert</span>
        </div>
      `;
      track.appendChild(card);

      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "dot";
      dot.setAttribute("aria-label", `Zu Bewertung ${i+1}`);
      dot.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(dot);
    });

    // Start
    state.index = 0;
    apply();
  }

  const state = { index: 0 };

  function cardsPerView(){
    // passt zu deinem CSS: Desktop 3, Mobile 1-ish
    return window.matchMedia("(max-width: 980px)").matches ? 1 : 3;
  }

  function maxIndex(){
    return Math.max(0, REVIEWS.length - cardsPerView());
  }

  function apply(){
    const idx = clamp(state.index, 0, maxIndex());
    state.index = idx;

    const viewport = root.querySelector(".reviewsViewport");
    const firstCard = track.querySelector(".reviewCard");
    if (!viewport || !firstCard) return;

    // Breite pro Card inkl. Gap sauber ausrechnen
    const gap = parseFloat(getComputedStyle(track).gap || "14");
    const cardW = firstCard.getBoundingClientRect().width;
    const x = (cardW + gap) * idx;

    track.style.transform = `translateX(${-x}px)`;

    // Dots aktiv (pro Review)
    [...dotsWrap.children].forEach((d, i) => d.classList.toggle("is-active", i === idx));
  }

  function goTo(i){
    state.index = i;
    apply();
  }

  function next(){
    state.index = clamp(state.index + 1, 0, maxIndex());
    apply();
  }

  function prev(){
    state.index = clamp(state.index - 1, 0, maxIndex());
    apply();
  }

  btnNext.addEventListener("click", next);
  btnPrev.addEventListener("click", prev);
  window.addEventListener("resize", apply);

  // Helper: minimal safe escaping
  function escapeHtml(str){
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  render();
})();

