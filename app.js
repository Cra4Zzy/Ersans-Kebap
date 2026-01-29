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

// 6) Trustindex Reviews Loader (keine inline scripts im Body)
(function loadTrustindex(){
  const root = document.getElementById("trustindex-root");
  if (!root) return;

  // verhindert doppelte Loads
  if (document.querySelector('script[data-trustindex="1"]')) return;

  const s = document.createElement("script");
  s.async = true;
  s.defer = true;
  s.dataset.trustindex = "1";
  s.src = "https://cdn.trustindex.io/loader.js?96eb59a62f8b7227e776bff8b32";
  root.appendChild(s);
})();
