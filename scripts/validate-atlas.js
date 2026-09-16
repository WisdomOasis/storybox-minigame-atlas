#!/usr/bin/env node
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

global.window = {};
require("../assets/story-data.js");
require("../assets/game-data.js");

const { stories } = window.StoryAtlasData;
const games = window.GameAtlasData;
const storyIds = new Set(stories.map(item => item.id));
const gameIds = new Set(games.map(item => item.id));
const selected = stories.filter(item => item.hasEmbeddedGames);
const pilots = stories.filter(item => item.pilot);

assert.equal(stories.length, 50, "The atlas must contain exactly 50 stories");
assert.equal(storyIds.size, 50, "Story IDs must be unique");
assert.equal(games.length, 50, "The atlas must retain 30 interaction mechanics and 20 Free Play games");
assert.equal(gameIds.size, 50, "Game IDs must be unique");
assert.equal(selected.length, 24, "Exactly 24 stories must contain embedded minigames");
assert.equal(stories.length - selected.length, 26, "Exactly 26 stories must remain interaction-only");
assert.equal(pilots.length, 10, "Exactly 10 stories must have detailed pilot blueprints");
assert.equal(selected.reduce((sum, story) => sum + story.embeddedGames.length, 0), 48, "Selected stories must have two embedded minigames each");

const referencedGames = new Set();
for (const story of stories) {
  assert.ok(story.title.en && story.title.zh, `${story.id} requires bilingual titles`);
  assert.ok(story.iconicDecision.en && story.iconicDecision.zh, `${story.id} requires a bilingual decision`);
  assert.ok(story.synopsis.en && story.synopsis.zh, `${story.id} requires a bilingual synopsis`);
  assert.ok([5, 7, 10, 12, 15].includes(story.durationTier), `${story.id} has an unsupported duration tier`);
  assert.ok(story.interactionBeats.length >= 2 && story.interactionBeats.length <= 4, `${story.id} must contain 2–4 interactions`);
  assert.equal(story.embeddedGames.length, story.hasEmbeddedGames ? 2 : 0, `${story.id} has an invalid embedded-game count`);
  story.mechanicIds.forEach(id => { assert.ok(gameIds.has(id) && id.startsWith("S"), `${story.id} references unknown mechanic ${id}`); referencedGames.add(id); });
  story.standaloneGameIds.forEach(id => { assert.ok(gameIds.has(id) && id.startsWith("G"), `${story.id} references unknown Free Play game ${id}`); referencedGames.add(id); });
  story.embeddedGames.forEach((game, index) => {
    assert.equal(game.id, `${story.id.toLowerCase()}-game-${index === 0 ? "a" : "b"}`, `${story.id} embedded-game ID is unstable`);
    assert.ok(game.title.en && game.title.zh && game.objective.en && game.objective.zh, `${game.id} must be bilingual`);
    game.mechanicIds.forEach(id => { assert.ok(gameIds.has(id) && id.startsWith("S"), `${game.id} references unknown mechanic ${id}`); referencedGames.add(id); });
  });
  if (story.pilot) {
    assert.equal(story.pilot.timeline.length, story.pilot.timelineZh.length, `${story.id} pilot timelines must match across languages`);
    assert.ok(story.pilot.projector[0] && story.pilot.projector[1], `${story.id} needs Projector variants`);
    assert.ok(story.pilot.box[0] && story.pilot.box[1], `${story.id} needs Audio Story Box variants`);
  }
}
assert.deepEqual([...gameIds].filter(id => !referencedGames.has(id)), [], "Every S/G item needs at least one applicable story");

const repoRoot = path.resolve(__dirname, "..");
const storyCoverDir = path.join(repoRoot, "assets", "stories");
const storyCoverManifestPath = path.join(storyCoverDir, "manifest.json");

assert.ok(fs.existsSync(storyCoverManifestPath), "Story cover prompt manifest is missing");
const storyCoverManifest = JSON.parse(fs.readFileSync(storyCoverManifestPath, "utf8"));
assert.equal(storyCoverManifest.length, 50, "Story cover manifest must contain exactly 50 entries");
assert.deepEqual(storyCoverManifest.map(item => item.id), stories.map(item => item.id), "Story cover manifest IDs must match story order");

for (const story of stories) {
  const filename = `${story.id.toLowerCase()}.webp`;
  assert.ok(fs.existsSync(path.join(storyCoverDir, filename)), `${story.id} cover is missing`);
}

for (const file of ["index.html", "assets/atlas-app.js", "assets/story-data.js"]) {
  const contents = fs.readFileSync(path.join(repoRoot, file), "utf8");
  assert.equal(contents.includes("32×32"), false, `${file} must not mention 32×32`);
}
const atlasApp = fs.readFileSync(path.join(repoRoot, "assets", "atlas-app.js"), "utf8");
assert.ok(atlasApp.includes("function storyCoverSrc"), "Atlas must derive story cover paths from story IDs");
assert.ok((atlasApp.match(/story-cover/g) || []).length >= 3, "Story covers must appear in cards, details, and comparisons");
const atlasCss = fs.readFileSync(path.join(repoRoot, "assets", "atlas.css"), "utf8");
assert.ok(atlasCss.includes(".story-cover"), "Story cover layout styles are missing");
const markdown = fs.readFileSync("/Users/gunsmoker/Documents/Obsidian Vault/小游戏产品库/50 个经典故事互动与小游戏映射.md", "utf8");
assert.ok(markdown.includes("## 50 个故事总览"), "The Obsidian review document is missing");
assert.equal((markdown.match(/^### ST\d{2}/gm) || []).length, 34, "Markdown must contain 24 embedded-game entries and 10 pilot entries");

console.log("Atlas validation passed: 50 stories, 24×2 embedded minigames, 10 pilots, and 50 bidirectional game links.");
