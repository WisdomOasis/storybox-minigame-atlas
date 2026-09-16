#!/usr/bin/env node
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const elements = new Map();
const documentListeners = {};

function makeElement(id = "") {
  const listeners = {};
  const classes = new Set();
  return {
    id,
    dataset: {},
    style: {},
    scrollTop: 0,
    addEventListener(type, listener) { listeners[type] = listener; },
    classList: {
      add(name) { classes.add(name); },
      remove(name) { classes.delete(name); },
      toggle(name, force) { force ? classes.add(name) : classes.delete(name); }
    },
    querySelector() { return makeElement(); },
    setAttribute() {},
    _listeners: listeners
  };
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

function clickDetail(kind, id) {
  documentListeners.click({
    target: {
      closest(selector) {
        if (selector === `[data-open-${kind}]`) return { dataset: { [`open${kind[0].toUpperCase()}${kind.slice(1)}`]: id } };
        return null;
      }
    }
  });
}

test("opening detail content resets the drawer to the top", () => {
  element("drawer").scrollTop = 180;
  clickDetail("story", "ST01");
  assert.equal(element("drawer").scrollTop, 0);
});

test("cross-navigation resets the drawer to the top", () => {
  element("drawer").scrollTop = 240;
  clickDetail("game", "S01");
  assert.equal(element("drawer").scrollTop, 0);

  element("drawer").scrollTop = 300;
  clickDetail("story", "ST01");
  assert.equal(element("drawer").scrollTop, 0);
});

test("language switching preserves the current drawer position", () => {
  clickDetail("game", "S01");
  element("drawer").scrollTop = 420;
  element("languageSwitch")._listeners.click({
    target: { closest() { return { dataset: { lang: "zh" } }; } }
  });
  assert.equal(element("drawer").scrollTop, 420);
});
