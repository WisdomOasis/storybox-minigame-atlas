#!/usr/bin/env node
global.window = {};
require("../assets/story-data.js");
require("../assets/game-data.js");

const { stories } = window.StoryAtlasData;
const gameMap = new Map(window.GameAtlasData.map(game => [game.id, game]));
const output = [];
const write = value => output.push(value);

write("# 50 个经典故事互动与小游戏映射");
write("");
write("> 评审材料 · v1 · 2026-09-16");
write("> 以 Patty 的《50 Classic Stories · Ages 3–6》为故事来源。标题属于公版故事，但所有剧本必须原创改写，不采用电影版本。原始 Excel 不在本材料中修改。");
write("");
write("## 设计框架");
write("");
write("```text");
write("故事互动（5–15 秒）");
write("  ↓ 即时改变当前场景");
write("故事内小游戏（20–75 秒）");
write("  ↓ 在情节压力下完成故事目标");
write("解锁 Free Play");
write("  ↓ 故事结束后反复游玩核心机制");
write("```");
write("");
write("统一叙事语法：");
write("");
write("```text");
write("发生了什么 → 为什么需要孩子 → 孩子在故事里做什么 → 设备如何反馈 → 故事因此怎样继续");
write("```");
write("");
write("- Projector：1024×576 完整投影画面，方向、确认、返回、按下/松开、双遥控器和可用的动作输入。");
write("- Audio Story Box：音频、旋钮、Star、Moon、Home、灯环和固定 16×16 点阵。");
write("- 50 个故事中，24 个包含两个不同的短小游戏；其余 26 个只保留自然叙事互动。");
write("- 10 个重点故事提供完整时间线、双设备版本、失败处理、年龄变化和文案对照。");
write("");
write("## 50 个故事总览");
write("");
write("| ID | Story / 故事 | 来源 | 年龄 | 时长 | 结构 | 关联机制与 Free Play | 分数 |");
write("|---|---|---|---:|---:|---|---|---:|");
for (const story of [...stories].sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))) {
  const structure = story.pilot ? "详细样板 · 2 个小游戏" : story.hasEmbeddedGames ? "2 个故事内小游戏" : "2–4 个叙事互动";
  const relations = [story.mechanicIds.join(" · "), story.standaloneGameIds.length ? `→ ${story.standaloneGameIds.join(" · ")}` : ""].filter(Boolean).join(" ");
  write(`| ${story.id} | **${story.title.en}**<br/>${story.title.zh} | ${story.sourceGroupName.zh} | ${story.ageRange} | ${story.durationTier} 分钟 | ${structure} | ${relations} | ${story.score} |`);
}
write("");
write("## 24 个故事内小游戏");
write("");
for (const story of stories.filter(item => item.hasEmbeddedGames)) {
  write(`### ${story.id} · ${story.title.en} / ${story.title.zh}`);
  write("");
  write(`**孩子面对的决定：** ${story.iconicDecision.zh}`);
  write("");
  story.embeddedGames.forEach((game, index) => {
    write(`${index + 1}. **${game.title.en} / ${game.title.zh}**（约 ${game.durationSeconds} 秒）  `);
    write(`   ${game.objective.zh}  `);
    write(`   机制：${game.mechanicIds.join(" · ")}`);
  });
  write("");
  if (story.standaloneGameIds.length) {
    write(`通关后推荐解锁：${story.standaloneGameIds.map(id => `${id} ${gameMap.get(id)?.title || ""}`).join("；")}`);
    write("");
  }
}
write("## 10 个详细样板");
write("");
for (const story of stories.filter(item => item.pilot)) {
  write(`### ${story.id} · ${story.title.en} / ${story.title.zh}`);
  write("");
  write(`- **时长：** ${story.durationTier} 分钟`);
  write(`- **孩子角色：** ${story.pilot.role[1]}`);
  write(`- **经典决定：** ${story.iconicDecision.zh}`);
  write(`- **核心方向：** ${story.synopsis.zh}`);
  write("");
  write("**故事时间线**");
  write("");
  story.pilot.timelineZh.forEach((step, index) => write(`${index + 1}. ${step}`));
  write("");
  write("**自然叙事互动**");
  write("");
  story.interactionBeats.forEach(beat => write(`- ${beat.zh}`));
  write("");
  write("**两个故事内小游戏**");
  write("");
  story.embeddedGames.forEach((game, index) => write(`${index + 1}. **${game.title.zh}**（${game.durationSeconds} 秒）：${game.objective.zh}`));
  write("");
  write("**设备差异**");
  write("");
  write(`- Projector：${story.pilot.projector[1]}`);
  write(`- Audio Story Box：${story.pilot.box[1]}`);
  write("");
  write("**反馈和年龄变化**");
  write("");
  write(`- 成功、犹豫、错误和无输入：${story.pilot.responses[1]}`);
  write(`- 年龄变化：${story.pilot.ages[1]}`);
  write("");
  write("**文案对照**");
  write("");
  write(`> ${story.pilot.contrast[1]}`);
  write("");
  if (story.standaloneGameIds.length) {
    write(`通关后推荐解锁：${story.standaloneGameIds.map(id => `${id} ${gameMap.get(id)?.title || ""}`).join("；")}`);
    write("");
  }
}
write("## 评分");
write("");
write("- 叙事融合：30%");
write("- 儿童主动参与：25%");
write("- 好玩与重玩价值：20%");
write("- 双设备适配：15%");
write("- 制作可行性：10%");
write("");
write("站点默认按综合评分从高到低展示；评分用于评审优先级，不代替儿童试玩。");
write("");
write("## 与小游戏库的关系");
write("");
write("- S01–S30：可复用的故事互动机制。");
write("- G01–G20：故事完成后可推荐并解锁的完整 Free Play。");
write("- 故事可以使用多个 S 机制，但最多只关联真正适合其情节的 G 游戏。");
write("- Free Play 不决定故事能否完成，也不阻断故事结局。");

process.stdout.write(`${output.join("\n")}\n`);
