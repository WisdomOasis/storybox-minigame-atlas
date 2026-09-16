(function () {
  "use strict";
  const stories = window.StoryAtlasData.stories;
  const games = window.GameAtlasData;
  const storyById = new Map(stories.map(item => [item.id, item]));
  const gameById = new Map(games.map(item => [item.id, item]));
  const storyCategories = window.StoryAtlasData.categoryNames;
  const gameCategories = ["即时反应","节奏模仿","记忆顺序","观察寻找","解谜推理","创造表达","合作社交","动作竞赛"];
  const metrics = {
    story:{en:["Narrative fit","Child agency","Fun & replay","Device fit","Feasibility"],zh:["叙事融合","儿童主动参与","好玩与重玩","双设备适配","制作可行性"]},
    game:{en:window.AtlasI18n.metrics,zh:["好玩程度","故事融合","重玩价值","规则清晰","双平台适配"]}
  };

  const copy = {
    en:{
      title:"Story × Minigame Decision Atlas", heroTitle:"Stories children can step into.", heroDescription:"Connect 50 public-domain tales to reusable story interactions, embedded minigames, and replayable Free Play.", stats:["Classic stories","Stories with minigames","Game ideas"],
      modes:["Stories","Games","Compare"], frameworkLabel:"Three layers of participation", frameworkTitle:"The story teaches the action before the game asks for skill.", framework:[["Story interaction","5–15 seconds · immediate narrative feedback"],["Embedded minigame","20–75 seconds · a story goal under playful pressure"],["Unlocked Free Play","Replay the mechanic after the story is complete"]],
      searchStory:"Search stories, decisions, mechanics, or games",searchGame:"Search games, mechanics, or Nintendo references",more:"More filters",less:"Fewer filters",clear:"Clear",deviceNote:"Projector: 1024×576 projection · Audio Story Box: audio + fixed 16×16 matrix",
      storyKicker:"Story-first review",storyTitle:"Choose the story, then inspect how play grows from it.",storyDescription:"Every story identifies the child's role, the famous decision, device-specific participation, and links back to reusable game mechanics.",
      gameKicker:"Mechanic-first review",gameTitle:"Start with the kind of fun, then find the stories it can serve.",gameDescription:"S01–S30 are reusable story-interaction mechanics. G01–G20 are complete Free Play games that can unlock after a story.",
      compareKicker:"Side-by-side review",compareTitle:"Compare up to three candidates of the same kind.",compareDescription:"Story and game scores use different criteria, so the atlas keeps their comparisons separate.",
      showing:(n,total)=>`Showing <strong>${n}</strong> of ${total} · Highest scores first`, noResults:"No items match these filters. Try removing one condition.", noCompare:"Select two or three stories or games to compare them here.",
      compare:"Compare",selected:"Selected",showCompare:"Compare side by side",pilot:"Detailed pilot",twoGames:"2 embedded minigames",interactionsOnly:"Story interactions only",minutes:"min",ages:"Ages",decision:"Iconic child decision",summary:"Story direction",participation:"Participation flow",beats:"Story interactions",embedded:"Embedded story minigames",devices:"Device versions",projector:"Projector · full projection",box:"Audio Story Box · 16×16",links:"Related mechanics and Free Play",pilotPlan:"Detailed pilot blueprint",timeline:"Story timeline",role:"Child's role",responses:"Success, hesitation, mistakes, and no input",ageScaling:"Age scaling",contrast:"Instruction vs. story language",direct:"Direct device instruction",storyLed:"Story-led language",noGames:"This story uses short narrative interactions without inserting a complete minigame.",
      tenSecond:"10-second play",coreLoop:"Core loop",replay:"Replay variables",nintendo:"Nintendo reference",adaptation:"Our adaptation",applicableStories:"Applicable stories",score:"Decision score",remove:"Remove", compareDifferent:"Selecting a different content type starts a new comparison.",
      growthKicker:"Cross-game layer",growthTitle:"Companions remember shared experiences.",growthCopy:"Story choices, co-op behavior, and minigame results create memories for the existing bear, rabbit, tiger, camel, and otter companions—without hunger meters, chores, XP bars, or absence penalties.",growthPath:"<b>Story choices<br />Co-op behavior</b><i>→</i><b>Shared experience<br />Companion memory</b><i>→</i><b>Meet → Trust<br />→ Resonance</b><i>→</i><b>Guardian<br />New responses</b>",
      source:'Story titles come from Patty’s public-domain list; every script must be an original retelling rather than a film adaptation. Nintendo references describe mechanics only: <a href="https://www.nintendo.com/en-gb/Games/Nintendo-Switch-games/WarioWare-Move-It--2403866.html">WarioWare</a>, <a href="https://www.nintendo.com/us/whatsnew/find-your-flow-in-rhythm-heaven-groove/">Rhythm Heaven</a>, <a href="https://www.nintendo.com/us/store/products/super-mario-party-jamboree-switch/">Super Mario Party</a>, <a href="https://media.nintendo.com/snipperclips/">Snipperclips</a>, and <a href="https://www.nintendo.com/en-gb/games/oms/labo/invent.html">Nintendo Labo</a>.',
      priority:{pilot:"Pilot",high:"High-fit",explore:"Explore"}, gameType:{story:"Story interaction",standalone:"Free Play game"}, maturity:{"已有成果":"Existing work","可玩 HTML 原型":"Playable HTML prototype","已有 Audio 原型":"Playable audio prototype","输入基础":"Input foundation","概念方案":"Concept design","新想法":"New idea"}, capability:{"当前可做":"Buildable now","能力扩展":"Capability extension","长期方向":"Long-term direction"}, players:{solo:"Solo",coop:"Co-op",versus:"Versus"}
    },
    zh:{
      title:"经典故事 × 小游戏决策地图",heroTitle:"让孩子真正走进故事。",heroDescription:"把 50 个公版故事与可复用互动、故事内小游戏和可重玩的自由玩法连接起来。",stats:["经典故事","含小游戏的故事","游戏创意"],
      modes:["故事","游戏","对比"],frameworkLabel:"三层参与结构",frameworkTitle:"先让故事教会动作，再由小游戏考验技巧。",framework:[["故事互动","5–15 秒 · 立即改变当前情节反馈"],["故事内小游戏","20–75 秒 · 在情节压力下完成故事目标"],["解锁自由玩法","故事结束后反复游玩核心机制"]],
      searchStory:"搜索故事、关键决定、互动机制或游戏",searchGame:"搜索游戏、机制或任天堂参考",more:"更多筛选",less:"收起筛选",clear:"清除",deviceNote:"Projector：1024×576 完整投影 · Audio Story Box：音频＋固定 16×16 点阵",
      storyKicker:"从故事出发",storyTitle:"先选择要讲的故事，再判断玩法怎样从情节中长出来。",storyDescription:"每个故事都说明儿童角色、经典决定、双设备参与方式，并反向关联可复用互动与自由游戏。",
      gameKicker:"从机制出发",gameTitle:"先选择核心乐趣，再查看它适合服务哪些故事。",gameDescription:"S01–S30 是可复用的故事互动机制；G01–G20 是故事通关后可解锁的完整自由游戏。",
      compareKicker:"并排评审",compareTitle:"最多比较三个相同类型的候选。",compareDescription:"故事和游戏采用不同评分标准，因此不会混在一起比较。",
      showing:(n,total)=>`显示 <strong>${n}</strong> / ${total} 项 · 综合评分从高到低`,noResults:"没有符合当前条件的内容，可以减少一项筛选。",noCompare:"请选择两到三个故事或游戏，再在这里并排比较。",
      compare:"对比",selected:"已选",showCompare:"并排对比",pilot:"详细样板",twoGames:"2 个故事内小游戏",interactionsOnly:"仅叙事互动",minutes:"分钟",ages:"年龄",decision:"孩子面对的经典决定",summary:"故事方向",participation:"参与流程",beats:"故事互动",embedded:"故事内小游戏",devices:"双设备版本",projector:"Projector · 完整投影",box:"Audio Story Box · 16×16",links:"关联互动机制与自由玩法",pilotPlan:"详细样板设计",timeline:"故事时间线",role:"孩子的角色",responses:"成功、犹豫、错误与无输入",ageScaling:"年龄变化",contrast:"设备指令与故事表达",direct:"直接设备指令",storyLed:"融入故事的表达",noGames:"这个故事使用短叙事互动，不强行插入完整小游戏。",
      tenSecond:"10 秒玩法",coreLoop:"核心循环",replay:"重玩变量",nintendo:"任天堂参考",adaptation:"我们的变化",applicableStories:"适用故事",score:"决策评分",remove:"移除",compareDifferent:"选择不同类型时会开始一组新的对比。",
      growthKicker:"跨游戏成长层",growthTitle:"伙伴会记住共同经历。",growthCopy:"故事选择、合作行为和小游戏表现会成为熊、兔、虎、骆驼和水獭伙伴的共同记忆；不加入饥饿值、日常任务、经验条或不登录惩罚。",growthPath:"<b>故事选择<br />合作行为</b><i>→</i><b>共同经历<br />伙伴记忆</b><i>→</i><b>Meet → Trust<br />→ Resonance</b><i>→</i><b>Guardian<br />新的回应</b>",
      source:'故事标题来自 Patty 的公版故事清单；所有剧本必须原创改写，不使用电影版本表达。任天堂资料只用于机制参考：<a href="https://www.nintendo.com/en-gb/Games/Nintendo-Switch-games/WarioWare-Move-It--2403866.html">《瓦力欧制造》</a>、<a href="https://www.nintendo.com/us/whatsnew/find-your-flow-in-rhythm-heaven-groove/">《节奏天国》</a>、<a href="https://www.nintendo.com/us/store/products/super-mario-party-jamboree-switch/">《超级马力欧派对》</a>、<a href="https://media.nintendo.com/snipperclips/">《你裁我剪！斯尼帕》</a>和 <a href="https://www.nintendo.com/en-gb/games/oms/labo/invent.html">Nintendo Labo</a>。',
      priority:{pilot:"详细样板",high:"高适配",explore:"探索"},gameType:{story:"故事互动",standalone:"自由游戏"},maturity:null,capability:null,players:{solo:"单人",coop:"合作",versus:"对战"}
    }
  };

  let locale = "en";
  try { locale = localStorage.getItem("atlas-language") === "zh" ? "zh" : "en"; } catch {}
  const state = { mode:"stories",search:"",device:"all",age:"all",source:"all",duration:"all",embedded:"all",priority:"all",storyCategory:"all",gameType:"all",players:"all",maturity:"all",capability:"all",gameCategory:"all",more:false };
  const comparison = { kind:null, ids:[] };
  let activeDetail = null;
  const $ = id => document.getElementById(id);
  const text = value => String(value ?? "").replace(/[&<>'"]/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[char]));
  const t = value => value && typeof value === "object" ? value[locale] : value;
  const c = () => copy[locale];
  const localGame = raw => locale === "en" ? window.AtlasI18n.englishItem(raw) : raw;
  const categoryLabel = story => t(story.categoryName);
  const gameCategoryLabel = raw => locale === "en" ? (window.AtlasI18n.category[raw.category]?.[0] || raw.category) : raw.category;
  const priorityLabel = value => c().priority[value];
  const ageOverlaps = (range,filter) => { if(filter === "all") return true; const nums=range.match(/\d+/g).map(Number); const f=filter.match(/\d+/g).map(Number); return nums[0] <= f[1] && nums[1] >= f[0]; };
  const applicableStories = game => stories.filter(story => game.id.startsWith("S") ? story.mechanicIds.includes(game.id) : story.standaloneGameIds.includes(game.id));

  function setOptions(id,rows,value="all") { const el=$(id); el.innerHTML=rows.map(([v,label])=>`<option value="${text(v)}">${text(label)}</option>`).join(""); el.value=value; }
  function translatedGameMeta(raw,key) { if(locale === "zh") return raw[key]; if(key === "maturity") return c().maturity[raw[key]] || raw[key]; if(key === "capability") return c().capability[raw[key]] || raw[key]; return raw[key]; }
  function gameDevice(raw) { if(raw.device.includes("both") || (raw.device.includes("projector") && raw.device.includes("box"))) return locale === "en"?"Both platforms":"双平台"; return raw.device.includes("projector")?"Projector":locale === "en"?"Audio Story Box":"Audio Story Box"; }
  function gameAge(raw) { const first=raw.age[0].split("-")[0],last=raw.age.at(-1).split("-")[1]; return locale === "en"?`Ages ${first}–${last}`:`${first}–${last} 岁`; }

  function configureFilters() {
    const all=locale === "en"?"All":"全部";
    setOptions("deviceFilter",[["all",locale==="en"?"All devices":"全部设备"],["projector","Projector"],["box",locale==="en"?"Audio Story Box · 16×16":"Audio Story Box · 16×16"],["both",locale==="en"?"Both platforms":"双平台"]],state.device);
    setOptions("ageFilter",[["all",locale==="en"?"All ages":"全部年龄"],["3-5",locale==="en"?"Ages 3–5":"3–5 岁"],["6-8",locale==="en"?"Ages 6–8":"6–8 岁"],["9-12",locale==="en"?"Ages 9–12":"9–12 岁"]],state.age);
    setOptions("sourceFilter",[["all",locale==="en"?"All story sources":"全部故事来源"],...Object.entries(window.StoryAtlasData.groups).map(([key,value])=>[key,t(value)])],state.source);
    setOptions("durationFilter",[["all",locale==="en"?"All durations":"全部时长"],...[5,7,10,12,15].map(value=>[String(value),`${value} ${c().minutes}`])],state.duration);
    setOptions("embeddedFilter",[["all",locale==="en"?"All participation":"全部参与结构"],["yes",c().twoGames],["no",c().interactionsOnly]],state.embedded);
    setOptions("priorityFilter",[["all",locale==="en"?"All priorities":"全部优先级"],["pilot",priorityLabel("pilot")],["high",priorityLabel("high")],["explore",priorityLabel("explore")]],state.priority);
    setOptions("storyCategoryFilter",[["all",locale==="en"?"All play patterns":"全部玩法类型"],...Object.entries(storyCategories).map(([key,value])=>[key,t(value)])],state.storyCategory);
    setOptions("gameTypeFilter",[["all",locale==="en"?"All game ideas":"全部游戏创意"],["story",c().gameType.story],["standalone",c().gameType.standalone]],state.gameType);
    setOptions("playersFilter",[["all",locale==="en"?"All player modes":"全部人数"],["solo",c().players.solo],["coop",c().players.coop],["versus",c().players.versus]],state.players);
    const maturities=[...new Set(games.map(x=>x.maturity))]; setOptions("maturityFilter",[["all",locale==="en"?"All maturity levels":"全部成熟度"],...maturities.map(v=>[v,translatedGameMeta({maturity:v},"maturity")])],state.maturity);
    const capabilities=[...new Set(games.map(x=>x.capability))]; setOptions("capabilityFilter",[["all",locale==="en"?"All capability levels":"全部能力层级"],...capabilities.map(v=>[v,translatedGameMeta({capability:v},"capability")])],state.capability);
    setOptions("gameCategoryFilter",[["all",locale==="en"?"All play patterns":"全部玩法类型"],...gameCategories.map(value=>[value,locale==="en"?window.AtlasI18n.category[value][0]:value])],state.gameCategory);
  }

  function matchesStory(story) {
    const hay=[story.id,story.title.en,story.title.zh,story.iconicDecision.en,story.iconicDecision.zh,story.synopsis.en,story.synopsis.zh,...story.mechanicIds,...story.standaloneGameIds,...story.embeddedGames.flatMap(g=>[g.title.en,g.title.zh,g.objective.en,g.objective.zh])].join(" ").toLowerCase();
    if(state.search && !hay.includes(state.search.toLowerCase())) return false;
    if(!ageOverlaps(story.ageRange,state.age)) return false;
    if(state.source!=="all"&&story.sourceGroup!==state.source) return false;
    if(state.duration!=="all"&&story.durationTier!==Number(state.duration)) return false;
    if(state.embedded==="yes"&&!story.hasEmbeddedGames||state.embedded==="no"&&story.hasEmbeddedGames) return false;
    if(state.priority!=="all"&&story.priority!==state.priority) return false;
    if(state.storyCategory!=="all"&&story.category!==state.storyCategory) return false;
    return true;
  }
  function matchesGame(raw) {
    const item=localGame(raw),en=window.AtlasI18n.englishItem(raw); const hay=[raw.id,raw.title,raw.pitch,raw.category,raw.nintendo,en.title,en.pitch,en.category,en.nintendo,...applicableStories(raw).flatMap(s=>[s.title.en,s.title.zh])].join(" ").toLowerCase();
    if(state.search&&!hay.includes(state.search.toLowerCase()))return false;
    if(state.device==="both"&&!raw.device.includes("both"))return false;
    if(["projector","box"].includes(state.device)&&!raw.device.includes(state.device)&&!raw.device.includes("both"))return false;
    if(state.age!=="all"&&!raw.age.includes(state.age))return false;
    if(state.gameType!=="all"&&raw.type!==state.gameType)return false;
    if(state.players!=="all"&&!raw.players.includes(state.players))return false;
    if(state.maturity!=="all"&&raw.maturity!==state.maturity)return false;
    if(state.capability!=="all"&&raw.capability!==state.capability)return false;
    if(state.gameCategory!=="all"&&raw.category!==state.gameCategory)return false;
    return Boolean(item);
  }

  function storyCard(story) {
    const selected=comparison.kind==="story"&&comparison.ids.includes(story.id);
    return `<article class="story-card"><button class="card-open" data-open-story="${story.id}"><div class="story-head"><span class="story-id">${story.id} · ${text(t(story.sourceGroupName))}</span><span class="score-badge">${story.score}</span></div><h3>${text(t(story.title))}<small>${locale==="en"?text(story.title.zh):text(story.title.en)}</small></h3><p class="decision">${text(t(story.iconicDecision))}</p><p class="summary">${text(t(story.synopsis))}</p><div class="tags"><span class="tag ${story.priority==="pilot"?"pilot":""}">${text(priorityLabel(story.priority))}</span><span class="tag">${story.ageRange} ${locale==="en"?"years":"岁"}</span><span class="tag">${story.durationTier} ${c().minutes}</span><span class="tag">${text(categoryLabel(story))}</span><span class="tag ${story.hasEmbeddedGames?"accent":""}">${story.hasEmbeddedGames?c().twoGames:c().interactionsOnly}</span></div></button><div class="card-footer"><span class="relation-count">${story.mechanicIds.join(" · ")}${story.standaloneGameIds.length?` → ${story.standaloneGameIds.join(" · ")}`:""}</span><button class="compare-toggle ${selected?"selected":""}" data-compare-kind="story" data-compare-id="${story.id}">${selected?c().selected:c().compare}</button></div></article>`;
  }
  function gameCard(raw) {
    const item=localGame(raw),selected=comparison.kind==="game"&&comparison.ids.includes(raw.id),links=applicableStories(raw).slice(0,3);
    return `<article class="game-card"><button class="card-open" data-open-game="${raw.id}"><figure class="concept"><img src="assets/concepts/${raw.id.toLowerCase()}.webp" loading="lazy" alt=""/><span class="visual-label projector">Projector</span><span class="visual-label box">Audio Box · 16×16</span></figure><div class="card-body"><div class="card-kicker"><span>${text(gameCategoryLabel(raw))} · ${text(c().gameType[raw.type])}</span><span>${raw.score}/100</span></div><h3>${text(item.title)}</h3><p class="summary">${text(item.pitch)}</p><div class="tags"><span class="tag">${text(gameDevice(raw))}</span><span class="tag">${text(gameAge(raw))}</span><span class="tag">${text(translatedGameMeta(raw,"maturity"))}</span></div><div class="game-links">${links.map(s=>`<span class="mini-link">${text(t(s.title))}</span>`).join("")}${applicableStories(raw).length>3?`<span class="mini-link">+${applicableStories(raw).length-3}</span>`:""}</div></div></button><div class="card-footer"><span class="relation-count">${applicableStories(raw).length} ${locale==="en"?"linked stories":"个关联故事"}</span><button class="compare-toggle ${selected?"selected":""}" data-compare-kind="game" data-compare-id="${raw.id}">${selected?c().selected:c().compare}</button></div></article>`;
  }

  function render() {
    const isStory=state.mode==="stories",isGame=state.mode==="games",isCompare=state.mode==="compare";
    $("framework").hidden=isCompare; $("controls").hidden=isCompare; $("storyGrid").hidden=!isStory; $("gameGrid").hidden=!isGame; $("compareView").hidden=!isCompare; $("growth").hidden=!isGame;
    $("storyFilters").hidden=!isStory; $("gameFilters").hidden=!isGame; $("storyFilters").classList.toggle("open",state.more); $("gameFilters").classList.toggle("open",state.more);
    if(isStory){const visible=stories.filter(matchesStory).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));$("storyGrid").innerHTML=visible.map(storyCard).join("");$("resultSummary").innerHTML=c().showing(visible.length,stories.length);$("emptyState").hidden=visible.length>0;}
    if(isGame){const visible=games.filter(matchesGame).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));$("gameGrid").innerHTML=visible.map(gameCard).join("");$("resultSummary").innerHTML=c().showing(visible.length,games.length);$("emptyState").hidden=visible.length>0;}
    if(isCompare)renderCompare();
    $("emptyState").textContent=c().noResults; updateCompareBar(); updateModeCopy();
  }

  function updateModeCopy() {
    const mode=state.mode;
    document.querySelectorAll("#modeNav button").forEach((button,index)=>{button.classList.toggle("active",button.dataset.mode===mode);button.querySelector("span").textContent=c().modes[index];});
    if(mode==="stories"){ $("sectionKicker").textContent=c().storyKicker;$("sectionTitle").textContent=c().storyTitle;$("sectionDescription").textContent=c().storyDescription; }
    if(mode==="games"){ $("sectionKicker").textContent=c().gameKicker;$("sectionTitle").textContent=c().gameTitle;$("sectionDescription").textContent=c().gameDescription; }
    if(mode==="compare"){ $("sectionKicker").textContent=c().compareKicker;$("sectionTitle").textContent=c().compareTitle;$("sectionDescription").textContent=c().compareDescription; }
    $("search").placeholder=mode==="games"?c().searchGame:c().searchStory;
  }

  function selectCompare(kind,id) {
    if(comparison.kind&&comparison.kind!==kind){comparison.kind=kind;comparison.ids=[];}
    if(!comparison.kind)comparison.kind=kind;
    const index=comparison.ids.indexOf(id); if(index>=0)comparison.ids.splice(index,1); else if(comparison.ids.length<3)comparison.ids.push(id);
    if(!comparison.ids.length)comparison.kind=null; render();
  }
  function updateCompareBar() {
    const selected=comparison.ids.map(id=>comparison.kind==="story"?storyById.get(id):gameById.get(id)).filter(Boolean);
    $("compareCount").textContent=`${selected.length} / 3`; $("compareBar").classList.toggle("open",selected.length>0&&state.mode!=="compare");
    $("compareSelection").innerHTML=selected.map(item=>`<span class="compare-chip">${text(comparison.kind==="story"?t(item.title):localGame(item).title)}</span>`).join("");
    $("showCompare").textContent=c().showCompare;
  }
  function metricRows(kind,ratings){return metrics[kind][locale].map((label,index)=>`<div class="metric"><span>${text(label)}</span><div class="metric-track"><div class="metric-fill" style="width:${ratings[index]*20}%"></div></div><b>${ratings[index]}</b></div>`).join("");}
  function renderCompare(){
    if(comparison.ids.length<2){$("compareView").innerHTML=`<div class="compare-empty">${text(c().noCompare)}</div>`;return;}
    if(comparison.kind==="story"){$("compareView").innerHTML=comparison.ids.map(id=>storyById.get(id)).map(s=>`<article class="compare-card"><div class="story-head"><span class="story-id">${s.id}</span><span class="score-badge">${s.score}</span></div><h3>${text(t(s.title))}</h3><button class="compare-toggle selected" data-compare-kind="story" data-compare-id="${s.id}">${c().remove}</button><div class="tags"><span class="tag">${text(priorityLabel(s.priority))}</span><span class="tag">${s.durationTier} ${c().minutes}</span><span class="tag">${s.hasEmbeddedGames?c().twoGames:c().interactionsOnly}</span></div><div class="compare-fact"><b>${c().decision}</b><p>${text(t(s.iconicDecision))}</p></div><div class="compare-fact"><b>${c().devices}</b><p>Projector · Audio Story Box 16×16</p></div><div class="compare-fact"><b>${c().links}</b><p>${s.mechanicIds.join(" · ")}${s.standaloneGameIds.length?` → ${s.standaloneGameIds.join(" · ")}`:""}</p></div>${metricRows("story",s.ratings)}</article>`).join("");}
    else{$("compareView").innerHTML=comparison.ids.map(id=>gameById.get(id)).map(raw=>{const item=localGame(raw);return `<article class="compare-card"><img src="assets/concepts/${raw.id.toLowerCase()}.webp" alt=""/><h3>${text(item.title)}</h3><button class="compare-toggle selected" data-compare-kind="game" data-compare-id="${raw.id}">${c().remove}</button><div class="tags"><span class="tag">${raw.score}/100</span><span class="tag">${text(translatedGameMeta(raw,"maturity"))}</span></div><div class="compare-fact"><b>${c().tenSecond}</b><p>${text(item.pitch)}</p></div><div class="compare-fact"><b>${c().applicableStories}</b><p>${applicableStories(raw).map(s=>text(t(s.title))).join(" · ")||"—"}</p></div>${metricRows("game",raw.ratings)}</article>`;}).join("");}
  }

  function storyLinks(story){return [...story.mechanicIds,...story.standaloneGameIds].map(id=>{const raw=gameById.get(id);return raw?`<button data-open-game="${id}">${id} · ${text(localGame(raw).title)}</button>`:"";}).join("");}
  function openStory(id){const s=storyById.get(id);if(!s)return;activeDetail={kind:"story",id};$("drawerId").textContent=`${s.id} · ${t(s.sourceGroupName)} · ${priorityLabel(s.priority)}`;
    const pilot=s.pilot?`<section class="detail-section"><h3>${c().pilotPlan}</h3><div class="pilot-grid"><div class="pilot-card"><h4>${c().role}</h4><p>${text(t({en:s.pilot.role[0],zh:s.pilot.role[1]}))}</p></div><div class="pilot-card"><h4>${c().timeline}</h4><ol class="timeline">${(locale==="en"?s.pilot.timeline:s.pilot.timelineZh).map((step,index)=>`<li>${index+1}. ${text(step)}</li>`).join("")}</ol></div><div class="pilot-card"><h4>${c().responses}</h4><p>${text(t({en:s.pilot.responses[0],zh:s.pilot.responses[1]}))}</p></div><div class="pilot-card"><h4>${c().ageScaling}</h4><p>${text(t({en:s.pilot.ages[0],zh:s.pilot.ages[1]}))}</p></div></div><div class="device-grid"><div class="device-card"><h4>${c().projector}</h4><p>${text(t({en:s.pilot.projector[0],zh:s.pilot.projector[1]}))}</p></div><div class="device-card"><h4>${c().box}</h4><p>${text(t({en:s.pilot.box[0],zh:s.pilot.box[1]}))}</p></div></div><h3 style="margin-top:20px">${c().contrast}</h3><div class="contrast"><blockquote><b>${c().direct}</b><br/>${text(t({en:s.pilot.contrast[0].split(" Story-led:")[0],zh:s.pilot.contrast[1].split(" 故事表达：")[0]}))}</blockquote><blockquote><b>${c().storyLed}</b><br/>${text(locale==="en"?(s.pilot.contrast[0].split(" Story-led:")[1]||s.pilot.contrast[0]):(s.pilot.contrast[1].split(" 故事表达：")[1]||s.pilot.contrast[1]))}</blockquote></div></section>`:"";
    $("drawerContent").innerHTML=`<h2>${text(t(s.title))}</h2><div class="tags"><span class="tag pilot">${text(priorityLabel(s.priority))}</span><span class="tag">${s.ageRange} ${locale==="en"?"years":"岁"}</span><span class="tag">${s.durationTier} ${c().minutes}</span><span class="tag">${text(categoryLabel(s))}</span></div><p class="lead">${text(t(s.synopsis))}</p><section class="detail-section"><h3>${c().decision}</h3><p>${text(t(s.iconicDecision))}</p><div class="narrative-chain"><span>${locale==="en"?"What happens":"发生了什么"}</span><span>${locale==="en"?"Why the child is needed":"为什么需要孩子"}</span><span>${locale==="en"?"In-world action":"故事中的动作"}</span><span>${locale==="en"?"Device feedback":"设备反馈"}</span><span>${locale==="en"?"Story consequence":"情节后果"}</span></div></section><section class="detail-section"><h3>${c().beats}</h3><ul class="beat-list">${s.interactionBeats.map(beat=>`<li>${text(t(beat))}</li>`).join("")}</ul></section><section class="detail-section"><h3>${c().embedded}</h3>${s.embeddedGames.length?`<div class="game-list">${s.embeddedGames.map(game=>`<article class="game-detail"><h4>${text(t(game.title))} · ${game.durationSeconds}s</h4><p>${text(t(game.objective))}</p><div class="tags">${game.mechanicIds.map(x=>`<span class="tag">${x}</span>`).join("")}</div></article>`).join("")}</div>`:`<p>${c().noGames}</p>`}</section><section class="detail-section"><h3>${c().devices}</h3><div class="device-grid"><div class="device-card"><h4>${c().projector}</h4><p>${text(s.pilot?t({en:s.pilot.projector[0],zh:s.pilot.projector[1]}):t(s.projectorVariant))}</p></div><div class="device-card"><h4>${c().box}</h4><p>${text(s.pilot?t({en:s.pilot.box[0],zh:s.pilot.box[1]}):t(s.audioBoxVariant))}</p></div></div></section>${pilot}<section class="detail-section"><h3>${c().links}</h3><div class="related-links">${storyLinks(s)}</div></section><section class="detail-section"><h3>${c().score} · ${s.score}/100</h3>${metricRows("story",s.ratings)}</section>`;openDrawer();}
  function openGame(id){const raw=gameById.get(id);if(!raw)return;activeDetail={kind:"game",id};const item=localGame(raw),linked=applicableStories(raw);$("drawerId").textContent=`${raw.id} · ${c().gameType[raw.type]} · ${gameCategoryLabel(raw)}`;$("drawerContent").innerHTML=`<img class="detail-image" src="assets/concepts/${raw.id.toLowerCase()}.webp" alt=""/><h2>${text(item.title)}</h2><div class="tags"><span class="tag">${raw.score}/100</span><span class="tag">${text(gameDevice(raw))}</span><span class="tag">${text(translatedGameMeta(raw,"maturity"))}</span><span class="tag">${text(translatedGameMeta(raw,"capability"))}</span></div><p class="lead">${text(item.pitch)}</p><section class="detail-section"><h3>${c().coreLoop}</h3><p>${text(item.loop)}</p></section><section class="detail-section"><h3>${c().devices}</h3><div class="device-grid"><div class="device-card"><h4>${c().projector}</h4><p>${text(item.projector)}</p></div><div class="device-card"><h4>${c().box}</h4><p>${text(item.box16)}</p></div></div></section><section class="detail-section"><h3>${c().ageScaling}</h3><p>${text(item.ageNote)}</p></section><section class="detail-section"><h3>${c().replay}</h3><p>${text(item.replay)}</p></section><section class="detail-section"><h3>${c().nintendo}</h3><p>${text(item.nintendo)}</p></section><section class="detail-section"><h3>${c().adaptation}</h3><p>${text(item.change)}</p></section><section class="detail-section"><h3>${c().applicableStories}</h3><div class="related-links">${linked.map(s=>`<button data-open-story="${s.id}">${s.id} · ${text(t(s.title))}</button>`).join("")||"—"}</div></section><section class="detail-section"><h3>${c().score} · ${raw.score}/100</h3>${metricRows("game",raw.ratings)}</section>`;openDrawer();}
  function openDrawer(){$("drawer").classList.add("open");$("backdrop").classList.add("open");$("drawer").setAttribute("aria-hidden","false");document.body.style.overflow="hidden";}
  function closeDrawer(){$("drawer").classList.remove("open");$("backdrop").classList.remove("open");$("drawer").setAttribute("aria-hidden","true");document.body.style.overflow="";activeDetail=null;}

  function applyLanguage(){document.documentElement.lang=locale==="en"?"en":"zh-CN";document.title=c().title;$("heroTitle").textContent=c().heroTitle;$("heroDescription").textContent=c().heroDescription;document.querySelectorAll("#heroStats span").forEach((el,index)=>el.textContent=c().stats[index]);$("frameworkLabel").textContent=c().frameworkLabel;$("frameworkTitle").textContent=c().frameworkTitle;$("frameworkSteps").innerHTML=c().framework.map(row=>`<li><b>${text(row[0])}</b><span>${text(row[1])}</span></li>`).join("");$("moreFilters").textContent=state.more?c().less:c().more;$("clearFilters").textContent=c().clear;$("deviceNote").textContent=c().deviceNote;$("growthKicker").textContent=c().growthKicker;$("growthTitle").textContent=c().growthTitle;$("growthCopy").textContent=c().growthCopy;$("growthPath").innerHTML=c().growthPath;$("sourceNote").innerHTML=c().source;document.querySelectorAll("#languageSwitch button").forEach(button=>button.classList.toggle("active",button.dataset.lang===locale));configureFilters();render();if(activeDetail)activeDetail.kind==="story"?openStory(activeDetail.id):openGame(activeDetail.id);}

  $("modeNav").addEventListener("click",event=>{const button=event.target.closest("[data-mode]");if(!button)return;state.mode=button.dataset.mode;render();});
  document.addEventListener("click",event=>{const story=event.target.closest("[data-open-story]");if(story){openStory(story.dataset.openStory);return;}const game=event.target.closest("[data-open-game]");if(game){openGame(game.dataset.openGame);return;}const compare=event.target.closest("[data-compare-id]");if(compare)selectCompare(compare.dataset.compareKind,compare.dataset.compareId);});
  $("languageSwitch").addEventListener("click",event=>{const button=event.target.closest("[data-lang]");if(!button)return;locale=button.dataset.lang;try{localStorage.setItem("atlas-language",locale);}catch{}applyLanguage();});
  $("moreFilters").addEventListener("click",()=>{state.more=!state.more;$("moreFilters").setAttribute("aria-expanded",String(state.more));$("moreFilters").textContent=state.more?c().less:c().more;render();});
  $("search").addEventListener("input",event=>{state.search=event.target.value.trim();render();});
  [["deviceFilter","device"],["ageFilter","age"],["sourceFilter","source"],["durationFilter","duration"],["embeddedFilter","embedded"],["priorityFilter","priority"],["storyCategoryFilter","storyCategory"],["gameTypeFilter","gameType"],["playersFilter","players"],["maturityFilter","maturity"],["capabilityFilter","capability"],["gameCategoryFilter","gameCategory"]].forEach(([id,key])=>$(id).addEventListener("change",event=>{state[key]=event.target.value;render();}));
  $("clearFilters").addEventListener("click",()=>{Object.assign(state,{search:"",device:"all",age:"all",source:"all",duration:"all",embedded:"all",priority:"all",storyCategory:"all",gameType:"all",players:"all",maturity:"all",capability:"all",gameCategory:"all"});$("search").value="";configureFilters();render();});
  $("showCompare").addEventListener("click",()=>{state.mode="compare";render();window.scrollTo({top:280,behavior:"smooth"});});
  $("closeDrawer").addEventListener("click",closeDrawer);$("backdrop").addEventListener("click",closeDrawer);document.addEventListener("keydown",event=>{if(event.key==="Escape")closeDrawer();});
  applyLanguage();
})();
