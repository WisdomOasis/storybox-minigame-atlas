#!/usr/bin/env node
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const elements = new Map();
const documentListeners = {};
let activeElement = null;

function makeElement(id = "") {
  const listeners = {};
  const classes = new Set();
  const element = {
    id,
    dataset: {},
    style: {},
    scrollTop: 0,
    focusCount: 0,
    isConnected: true,
    addEventListener(type, listener) { listeners[type] = listener; },
    classList: {
      add(name) { classes.add(name); },
      contains(name) { return classes.has(name); },
      remove(name) { classes.delete(name); },
      toggle(name, force) { force ? classes.add(name) : classes.delete(name); }
    },
    focus(options) {
      this.focusCount += 1;
      this.focusOptions = options;
      activeElement = this;
      if (this.id === "detail-heading") elements.get("drawer").scrollTop = 999;
    },
    querySelector(selector) { return selector === "h2" ? this._heading : makeElement(); },
    setAttribute() {},
    _listeners: listeners
  };
  Object.defineProperty(element, "innerHTML", {
    get() { return this._innerHTML || ""; },
    set(value) {
      this._innerHTML = value;
      if (value.includes("<h2")) {
        this._heading = makeElement("detail-heading");
        this._heading.tabIndex = value.includes('<h2 tabindex="-1"') ? -1 : 0;
      }
    }
  });
  return element;
}

function element(id) {
  if (!elements.has(id)) elements.set(id, makeElement(id));
  return elements.get(id);
}

const languageButtons = ["en", "zh"].map(lang => {
  const button = makeElement();
  button.dataset.lang = lang;
  return button;
});
const modeButtons = ["stories", "games", "compare"].map(mode => {
  const button = makeElement();
  button.dataset.mode = mode;
  return button;
});

const document = {
  body: makeElement("body"),
  documentElement: makeElement("html"),
  get activeElement() { return activeElement; },
  getElementById: element,
  addEventListener(type, listener) { documentListeners[type] = listener; },
  querySelectorAll(selector) {
    if (selector === "#heroStats span") return [makeElement(), makeElement(), makeElement()];
    if (selector === "#languageSwitch button") return languageButtons;
    if (selector === "#modeNav button") return modeButtons;
    return [];
  }
};

const context = vm.createContext({
  console,
  document,
  localStorage: { getItem() { return null; }, setItem() {} },
  window: {}
});
context.window.window = context.window;

const repoRoot = path.resolve(__dirname, "..");
for (const file of ["assets/story-data.js", "assets/game-data.js", "assets/atlas-i18n.js", "assets/atlas-app.js"]) {
  vm.runInContext(fs.readFileSync(path.join(repoRoot, file), "utf8"), context, { filename: file });
}

function clickDetail(kind, id, opener = makeElement(`${kind}-opener`)) {
  const datasetKey = `open${kind[0].toUpperCase()}${kind.slice(1)}`;
  opener.dataset[datasetKey] = id;
  opener.focus();
  documentListeners.click({
    target: {
      closest(selector) {
        if (selector === `[data-open-${kind}]`) return opener;
        return null;
      }
    }
  });
  return opener;
}

function closeDrawerWithEscape() {
  documentListeners.keydown({ key: "Escape" });
}

function assertFocusedDetailAtTop() {
  const heading = element("drawerContent").querySelector("h2");
  assert.equal(heading.tabIndex, -1);
  assert.equal(document.activeElement, heading);
  assert.equal(heading.focusOptions.preventScroll, true);
  assert.equal(element("drawer").scrollTop, 0);
}

test("opening detail content focuses its heading and resets the drawer to the top", () => {
  element("drawer").scrollTop = 180;
  clickDetail("story", "ST01");
  assertFocusedDetailAtTop();
  closeDrawerWithEscape();
});

test("cross-navigation focuses each new heading and resets the drawer to the top", () => {
  element("drawer").scrollTop = 240;
  clickDetail("game", "S01");
  assertFocusedDetailAtTop();

  element("drawer").scrollTop = 300;
  clickDetail("story", "ST01");
  assertFocusedDetailAtTop();
  closeDrawerWithEscape();
});

test("language switching preserves scroll without moving focus", () => {
  clickDetail("game", "S01");
  element("drawer").scrollTop = 420;
  languageButtons[1].focus();
  const focusedBeforeSwitch = document.activeElement;
  element("languageSwitch")._listeners.click({
    target: { closest() { return { dataset: { lang: "zh" } }; } }
  });
  assert.equal(element("drawer").scrollTop, 420);
  assert.equal(document.activeElement, focusedBeforeSwitch);
  assert.equal(element("drawerContent").querySelector("h2").focusCount, 0);
  closeDrawerWithEscape();
});

test("Escape restores the original opener after related cross-navigation", () => {
  const originalOpener = makeElement("original-opener");
  clickDetail("story", "ST01", originalOpener);

  const relatedLink = makeElement("related-link");
  clickDetail("game", "S01", relatedLink);
  closeDrawerWithEscape();

  assert.equal(document.activeElement, originalOpener);
  assert.equal(originalOpener.focusCount, 2);
  assert.equal(originalOpener.focusOptions.preventScroll, true);
  assert.equal(relatedLink.focusCount, 1);
});

test("closing tolerates a disconnected opener", () => {
  const opener = clickDetail("story", "ST01");
  opener.isConnected = false;
  assert.doesNotThrow(closeDrawerWithEscape);
  assert.equal(element("drawer").classList.contains("open"), false);
});
