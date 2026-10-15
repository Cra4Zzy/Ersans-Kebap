const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const {
  normalizeMenuText,
  menuItemMatches,
  openingStatus,
  sendPreorder,
} = require("../js/app.js");
async function main() {
  assert.equal(
    normalizeMenuText("  DÖNER mit SOẞE  "),
    "doner mit soße".replace("ß", "ss"),
  );
  assert.equal(
    menuItemMatches("Dürüm Drehspieß", "doener", "doener", "durum"),
    true,
  );
  assert.equal(
    menuItemMatches("Drehspieß normal", "doener", "alle", "Döner"),
    true,
  );
  assert.equal(
    menuItemMatches("Drehspieß normal", "doener", "alle", "doener"),
    true,
  );
  assert.equal(
    menuItemMatches("Dürüm Drehspieß", "doener", "alle", "dueruem"),
    true,
  );
  assert.equal(
    menuItemMatches("Pizza Margherita", "pizza", "doener", "pizza"),
    false,
  );
  assert.equal(
    menuItemMatches("Gemischter Salat", "salate", "alle", "SALAT"),
    true,
  );
  assert.equal(
    menuItemMatches("Pizza", "pizza", "alle", "nicht vorhanden"),
    false,
  );
  const cases = [
    ["2026-10-15T10:30:00Z", true, "bis 14"],
    ["2026-10-15T12:00:00Z", false, "17 Uhr"],
    ["2026-10-15T15:30:00Z", true, "bis 21"],
    ["2026-10-15T19:00:00Z", false, "Morgen"],
    ["2026-10-12T10:30:00Z", false, "Ruhetag"],
    ["2026-10-18T19:00:00Z", false, "Dienstag"],
    ["2026-10-25T11:30:00Z", true, "bis 14"],
    ["2026-12-09T11:00:00Z", true, "bis 14"],
  ];
  for (const [date, open, text] of cases) {
    const status = openingStatus(new Date(date));
    assert.equal(status.open, open, date);
    assert(status.text.includes(text), date);
  }
  const body = { name: "Test" };
  let request;
  await sendPreorder("https://test.invalid/form", body, async (url, opts) => {
    request = { url, opts };
    return { ok: true };
  });
  assert.equal(request.opts.headers.Accept, "application/json");
  assert.equal(request.opts.method, "POST");
  assert.equal(request.opts.body, body);
  await assert.rejects(
    () =>
      sendPreorder("https://test.invalid/form", body, async () => ({
        ok: false,
      })),
    /FORM_REJECTED/,
  );
  await assert.rejects(
    () =>
      sendPreorder("https://test.invalid/form", body, async () => {
        throw Error("offline");
      }),
    /offline/,
  );
  const menu = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../data/menu.json"), "utf8"),
  );
  assert.equal(
    menu.reduce((n, g) => n + g.items.length, 0),
    64,
  );
  assert.equal(
    menu.flatMap((g) => g.items).find((i) => i.name === "Currywurst mit Pommes")
      .price,
    "10,50 €",
  );
  // Execute the real DOM handler with a small form fixture. No request leaves the process.
  const listeners = {},
    field = (value) => ({
      value,
      validity: "",
      addEventListener() {},
      setCustomValidity(v) {
        this.validity = v;
      },
    }),
    name = field("Testperson"),
    message = field("Zwei Döner ohne Zwiebeln bitte.");
  const label = { textContent: "" },
    submit = { disabled: false, querySelector: () => label },
    counter = { textContent: "" },
    feedback = {
      textContent: "",
      classList: { add() {}, remove() {} },
      focus() {},
    },
    attrs = {};
  const form = {
    elements: { name, message },
    action: "https://formspree.io/f/mbdknvvg",
    querySelector: () => submit,
    addEventListener: (type, fn) => (listeners[type] = fn),
    reportValidity: () => !name.validity && !message.validity,
    setAttribute: (k, v) => (attrs[k] = v),
    removeAttribute: (k) => delete attrs[k],
    reset: () => {
      name.value = "";
      message.value = "";
    },
  };
  const selectors = {
    "#preorderForm": form,
    "#form-feedback": feedback,
    "[data-message-count]": counter,
  };
  let calls = 0;
  let resolve;
  const win = {
    matchMedia: () => ({ matches: true }),
    addEventListener() {},
    scrollY: 0,
    fetch: async () => {
      calls++;
      return new Promise((r) => (resolve = r));
    },
  };
  const context = {
    URL,
    URLSearchParams,
    Intl,
    Date,
    console,
    setTimeout,
    clearTimeout,
    AbortController,
    Image: function () {},
    FormData: function (f) {
      this.name = f.elements.name.value;
      this.message = f.elements.message.value;
    },
    window: win,
    location: { href: "https://example.test/html/kontakt.html" },
    document: {
      currentScript: { src: "https://example.test/js/app.js" },
      baseURI: "https://example.test/html/kontakt.html",
      querySelector: (s) => selectors[s] || null,
      querySelectorAll: () => [],
      addEventListener() {},
    },
    module: { exports: {} },
  };
  vm.createContext(context);
  vm.runInContext(
    fs.readFileSync(path.join(__dirname, "../js/app.js"), "utf8"),
    context,
  );
  const first = listeners.submit({ preventDefault() {} });
  assert.equal(submit.disabled, true);
  assert.equal(attrs["aria-busy"], "true");
  await listeners.submit({ preventDefault() {} });
  assert.equal(calls, 1, "Prevent duplicate submissions");
  resolve({ ok: false });
  await first;
  assert.equal(name.value, "Testperson");
  assert.equal(message.value, "Zwei Döner ohne Zwiebeln bitte.");
  assert.equal(submit.disabled, false);
  assert(feedback.textContent.includes("Eingaben bleiben erhalten"));
  const second = listeners.submit({ preventDefault() {} });
  resolve({ ok: true });
  await second;
  assert.equal(name.value, "");
  assert.equal(message.value, "");
  assert.equal(submit.disabled, false);
  assert(feedback.textContent.includes("persönliche Bestätigung"));
  assert.equal(attrs["aria-busy"], undefined);
  name.value = "   ";
  message.value = "            ";
  const before = calls;
  await listeners.submit({ preventDefault() {} });
  assert.equal(calls, before, "Reject whitespace-only input");
  console.log(
    "PASS: menu matching, normalization, Berlin opening times including DST, HTTP errors, duplicate protection, form success/failure and retained inputs",
  );
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
