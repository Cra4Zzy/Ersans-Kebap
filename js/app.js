document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});

const header = document.querySelector("[data-sticky]");
const updateHeader = () => {
  if (header) header.classList.toggle("is-scrolled", window.scrollY > 18);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const burger = document.querySelector("[data-burger]");
const nav = document.querySelector("[data-nav]");

if (burger && nav) {
  const setMenu = (open) => {
    nav.classList.toggle("is-open", open);
    burger.classList.toggle("is-active", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Menü schließen" : "Menü öffnen");
    document.body.classList.toggle("nav-open", open);
  };

  burger.addEventListener("click", () => {
    setMenu(!nav.classList.contains("is-open"));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenu(false);
      burger.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1120) setMenu(false);
  }, { passive: true });
}

const revealItems = document.querySelectorAll("[data-reveal]");

if (revealItems.length && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, activeObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        activeObserver.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: "0px 0px -7%",
    threshold: 0.08,
  });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-in"));
}

const preorderForm = document.getElementById("preorderForm");

if (preorderForm) {
  preorderForm.addEventListener("submit", () => {
    const submitButton = preorderForm.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Wird gesendet …";
    }
  });
}

(function initReviewsCarousel() {
  const root = document.getElementById("reviewsWidget");
  if (!root) return;

  const track = root.querySelector("[data-reviews-track]");
  const dotsWrap = root.querySelector("[data-reviews-dots]");
  const previousButton = root.querySelector("[data-reviews-prev]");
  const nextButton = root.querySelector("[data-reviews-next]");
  if (!track || !dotsWrap || !previousButton || !nextButton) return;

  const reviews = [
    {
      name: "Y A",
      when: "vor 4 Monaten",
      stars: 5,
      text: "Einfach der beste Döner in Dinkelsbühl! Qualitativ und geschmacklich gibt es im Umkreis niemand besseren als Ersan's Kebap.",
    },
    {
      name: "Raphael Keller",
      when: "vor 3 Monaten",
      stars: 5,
      text: "Super Laden! Döner schmeckt richtig richtig lecker, Ambiente top und der Vibe ist unschlagbar. 10/10.",
    },
    {
      name: "Ramazan",
      when: "vor 3 Monaten",
      stars: 5,
      text: "Bester Döner im Umkreis mit einem sehr netten Dönermann.",
    },
    {
      name: "Martin Hochrein",
      when: "vor 5 Monaten",
      stars: 5,
      text: "Fladen, Pizzateig und Falafel werden hier selbst gemacht – und das schmeckt man!",
    },
    {
      name: "Krisztina Szász Erdélyi",
      when: "vor 8 Monaten",
      stars: 5,
      text: "Sehr leckeres Essen, große Portionen. Schneller Service. Wir essen gerne hier.",
    },
    {
      name: "Marcus Schneider",
      when: "vor einem Jahr",
      stars: 5,
      text: "Bester Döner und beste Pizza in meinem Leben. Unglaublich gut – komme gerne wieder vorbei!",
    },
    {
      name: "Markus Korn",
      when: "vor einem Jahr",
      stars: 5,
      text: "Die Pizza ist ein Traum: leckerer Teig, dünner knuspriger Rand, reichlich belegt – optisch tippi toppi.",
    },
    {
      name: "Julian Hochstatter",
      when: "vor einem Jahr",
      stars: 5,
      text: "Pide Döner ein Gedicht. Dönerteller mit viel Soße und sehr leckerem Salat. Bedienungen sehr nett – wir kommen wieder.",
    },
    {
      name: "Kritischer Geist!",
      when: "vor einem Jahr",
      stars: 5,
      text: "2× Drehspießteller mit Salat und Pommes gegessen – richtig gut!",
    },
  ];

  const escapeHtml = (value) => String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");

  track.innerHTML = reviews.map((review) => {
    const initials = review.name.trim().split(/\s+/).slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase()).join("");
    const stars = "★".repeat(review.stars) + "☆".repeat(Math.max(0, 5 - review.stars));

    return `
      <article class="reviewCard">
        <div class="reviewTop">
          <div class="reviewPerson">
            <div class="avatar" aria-hidden="true">${escapeHtml(initials || "★")}</div>
            <div>
              <div class="reviewName">${escapeHtml(review.name)}</div>
              <div class="reviewSub">${escapeHtml(review.when)}</div>
            </div>
          </div>
          <div class="stars" aria-label="${review.stars} von 5 Sternen">${stars}</div>
        </div>
        <p class="reviewText">${escapeHtml(review.text)}</p>
        <div class="reviewFooter">
          <span class="gBadge"><span class="gDot"></span> Google</span>
          <span class="reviewSub">Verifiziert</span>
        </div>
      </article>`;
  }).join("");

  let index = 0;
  let pointerStart = null;

  const cardsPerView = () => {
    if (window.matchMedia("(max-width: 820px)").matches) return 1;
    if (window.matchMedia("(max-width: 1120px)").matches) return 2;
    return 3;
  };

  const maxIndex = () => Math.max(0, reviews.length - cardsPerView());

  const update = () => {
    index = Math.min(Math.max(index, 0), maxIndex());
    const firstCard = track.querySelector(".reviewCard");
    if (!firstCard) return;

    const gap = parseFloat(window.getComputedStyle(track).gap || "14");
    const step = firstCard.getBoundingClientRect().width + gap;
    track.style.transform = `translate3d(${-index * step}px, 0, 0)`;

    Array.from(dotsWrap.children).forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === index);
    });

    previousButton.disabled = index === 0;
    nextButton.disabled = index === maxIndex();
  };

  const renderDots = () => {
    dotsWrap.innerHTML = "";
    for (let dotIndex = 0; dotIndex <= maxIndex(); dotIndex += 1) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = `dot${dotIndex === index ? " is-active" : ""}`;
      dot.setAttribute("aria-label", `Zu Bewertung ${dotIndex + 1}`);
      dot.addEventListener("click", () => {
        index = dotIndex;
        update();
      });
      dotsWrap.appendChild(dot);
    }
  };

  previousButton.addEventListener("click", () => {
    index -= 1;
    update();
  });

  nextButton.addEventListener("click", () => {
    index += 1;
    update();
  });

  track.addEventListener("pointerdown", (event) => {
    pointerStart = event.clientX;
  });

  track.addEventListener("pointerup", (event) => {
    if (pointerStart === null) return;
    const distance = event.clientX - pointerStart;
    if (Math.abs(distance) > 45) {
      index += distance < 0 ? 1 : -1;
      update();
    }
    pointerStart = null;
  });

  track.addEventListener("pointercancel", () => {
    pointerStart = null;
  });

  window.addEventListener("resize", () => {
    renderDots();
    update();
  }, { passive: true });

  renderDots();
  update();
}());
