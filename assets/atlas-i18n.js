(function () {
  const entries = {
    S01: ["Danger Callout", "A character suddenly calls out a hazard and an escape direction. The child reacts, and the scene immediately plays the dodge result."],
    S02: ["Last-Second Shield", "Hold to protect when the charge-up sound begins, then release as soon as the impact ends."],
    S03: ["Freeze-and-Hide", "Move while the guard looks away, then freeze when the music stops or the guard turns back."],
    S04: ["Catch the Falling Prop", "Follow the character's call or the projected cue and move the basket to catch the story prop."],
    S05: ["Emergency Repair", "Break a story crisis into a rapid chain of three-second actions and watch the scene recover step by step."],
    S06: ["Secret Knock", "A character behind the door taps a short rhythm. The child answers with the same two-sound pattern."],
    S07: ["Magic Echo", "A sprite sings a short direction-and-rhythm phrase. Repeating it correctly lights the spell layer by layer."],
    S08: ["Bridge in Step", "Keep a steady beat across a swaying bridge. When someone slips off-beat, companions pull one another back."],
    S09: ["Character Chorus", "A character sings the first half of a phrase; the child answers in the open beats with a sound or action."],
    S10: ["Sound Path", "Remember landmark sounds such as forest, river, and bell, then choose directions in the same order."],
    S11: ["Magic Recipe", "Remember the order in which the wizard adds ingredients, then rebuild the recipe yourself."],
    S12: ["Who Said It?", "Use dialogue from the scene that just happened to identify which character really spoke the line."],
    S13: ["Reverse Mechanism", "The mechanism demonstrates a sequence; the child enters it backwards, starting from the final action."],
    S14: ["Find the Caller", "Use the call, voice, and emotion to find the character who genuinely needs help."],
    S15: ["Who's in the Shadow?", "Match a pixel silhouette with footsteps and signature sounds to identify the hidden character."],
    S16: ["Spot the Difference", "One sound or visual detail is different from the rest. Find the disguised character or object."],
    S17: ["Follow the Footprints", "Use the number, direction, and weight of footsteps to work out where the character went."],
    S18: ["Choose the Right Tool", "Select one of a few tools and perform the matching action to solve the character's immediate problem."],
    S19: ["Forking-Path Maze", "Follow story clues through a sequence of forks, opening different short events along the route."],
    S20: ["Balance the Rope Bridge", "Read the wind and companion positions, then adjust the balance to choose a safe way across."],
    S21: ["Three Logic Doors", "Each door offers a true-or-false clue. Choose the one that best fits the current story conditions."],
    S22: ["Paint the Night Sky", "Choose colors, rhythms, or actions to create a different sky for the next story scene."],
    S23: ["Copy the Little Monster", "Imitate the monster's sound or movement and watch it answer with an exaggerated upgrade."],
    S24: ["Compose a Victory Tune", "Choose a small set of notes and drum hits so the cast can perform a unique end-of-chapter tune."],
    S25: ["Pull Together", "Two players pull in opposite directions at the same time to rescue a character or lift an object."],
    S26: ["You Say, I Do", "One player receives the clue but cannot act; the other completes the task from their description."],
    S27: ["Signal Relay", "Players receive, remember, and pass on a signal in sequence so the final player can trigger the rescue."],
    S28: ["Story Chase", "The hero moves automatically while players dodge, jump, and choose shortcuts from incoming cues."],
    S29: ["Boss Weak-Point Battle", "Read the boss's sound and movement pattern, then answer with the right ability inside the timing window."],
    S30: ["Treasure Rush", "Race the clock to find clues and avoid traps, then decide whether to share or compete for the treasure."],
    G01: ["Magic Orchard", "Move baskets together to catch good fruit, avoid spoiled fruit, and keep a shared team combo alive."],
    G02: ["Riverlight Rhythm", "The game plays a rhythm phrase and players answer in turn to keep a glowing river flowing."],
    G03: ["Ear Racer", "Auto-cruise through audio hazards, collect stars, then press GO once to spend a charged boost."],
    G04: ["Candy Drum Party", "Hear a drum phrase inside the song, then echo it in the response bar with Star and Moon."],
    G05: ["Three-Second Mayhem", "Shake, stop, turn, or press through a rapid stream of three-second microgames."],
    G06: ["Freeze Patrol", "Move while the music plays and become perfectly still the instant it stops."],
    G07: ["Balloon Rescue Crew", "Work together to inflate a balloon to the target size without letting it burst."],
    G08: ["Direction Dojo", "Recognize directions quickly, then handle feints, reversals, and two-step commands."],
    G09: ["Beatspell Battle", "Hear a monster's rhythmic weakness and cast the correct sound spell in the open beat."],
    G10: ["Animal Orchestra", "Each player owns an animal part and must enter, stop, or hand off at the right beat."],
    G11: ["Sound Train", "Each station adds a sound carriage. Replay the growing sequence to keep the train moving."],
    G12: ["Reverse Lab", "Perform the experiment steps in reverse order, starting with the last thing you heard or saw."],
    G13: ["Pixel Pattern Relay", "A pattern flashes briefly; players remember different sections and rebuild the whole image together."],
    G14: ["Junior Sound Detective", "Compare scene sounds, character testimony, and object noises to deduce what happened."],
    G15: ["Shadow Shuffle", "Track a character as shadows swap places, then confirm the answer with an audio clue."],
    G16: ["Treasure Radar", "Turn or tilt the device and follow stronger feedback to locate a hidden treasure."],
    G17: ["Story Repair Shop", "Two players control different parts and communicate to repair a bridge, machine, or pattern."],
    G18: ["Magic Recipe Lab", "Reason from a guest's request and ingredient properties to mix a fitting magical recipe."],
    G19: ["Secret-Code Relay", "Players take turns receiving and passing a short code while trying to keep it unchanged."],
    G20: ["Motion Party Cup", "Complete a cup of short tilt, shake, freeze, and direction events to earn a team trophy."]
  };

  const category = {
    "即时反应": ["Quick Reaction", "Hear it, do it"],
    "节奏模仿": ["Rhythm & Imitation", "Call and response"],
    "记忆顺序": ["Memory & Sequence", "Remember and replay"],
    "观察寻找": ["Observe & Find", "Spot the key clue"],
    "解谜推理": ["Puzzles & Reasoning", "Understand cause and effect"],
    "创造表达": ["Creative Expression", "No single right answer"],
    "合作社交": ["Cooperation", "Communicate and share roles"],
    "动作竞赛": ["Action & Competition", "Movement and excitement"]
  };

  const impact = { "场景动作":"Scene action", "路线分支":"Route branch", "关键结果":"Key outcome", "独立游戏":"Standalone game" };
  const maturity = { "已有成果":"Existing work", "可玩 HTML 原型":"Playable HTML prototype", "已有 Audio 原型":"Playable audio prototype", "输入基础":"Input foundation", "概念方案":"Concept design", "新想法":"New idea" };
  const capability = { "当前可做":"Buildable now", "能力扩展":"Capability extension", "长期方向":"Long-term direction" };
  const players = { solo:"Solo", coop:"Co-op", versus:"Versus" };
  const metrics = ["Fun", "Story fit", "Replay value", "Rule clarity", "Cross-device fit"];
  const loops = {
    "即时反应":"Clear cue → immediate action → funny, safe, or skillful outcome → next cue.",
    "节奏模仿":"Hear the phrase → answer in the response window → musical feedback → the phrase evolves.",
    "记忆顺序":"Observe or listen → retain the sequence → replay it → reveal the result and add complexity.",
    "观察寻找":"Gather a visual or audio clue → compare candidates → choose → reveal or receive a helpful correction.",
    "解谜推理":"Understand the goal → compare clues or tools → act → see the consequence and revise if needed.",
    "创造表达":"Choose a sound, color, or action → combine choices → the world performs the result → create again.",
    "合作社交":"Share partial information or roles → coordinate → act together → receive a shared result.",
    "动作竞赛":"Read the cue → move or choose under pressure → gain an advantage or comic setback → continue to the finish."
  };
  const replays = {
    "即时反应":"Cue order, timing, hazards, characters, and comic outcomes change between runs.",
    "节奏模仿":"Tempo, phrase length, instruments, roles, and musical arrangement vary.",
    "记忆顺序":"Sequence length, symbols, sounds, distractions, and reversal rules vary.",
    "观察寻找":"Clues, hiding places, candidates, scene details, and decoys vary.",
    "解谜推理":"Goals, constraints, tools, clue combinations, and valid solutions vary.",
    "创造表达":"Materials, colors, sounds, prompts, performers, and resulting scenes vary.",
    "合作社交":"Role assignment, hidden information, timing, signal sets, and team goals vary.",
    "动作竞赛":"Course layout, event order, pace, opponents, shortcuts, and team targets vary."
  };
  const references = {
    "即时反应":"Nintendo reference: WarioWare's instantly readable microgame commands and single decisive actions.",
    "节奏模仿":"Nintendo reference: Rhythm Heaven's audio-led rules, call-and-response structure, and comic timing.",
    "记忆顺序":"Nintendo reference: Big Brain Academy's short, scalable memory and sequencing tasks.",
    "观察寻找":"Nintendo reference: Big Brain Academy's fast recognition, comparison, and visual tracking challenges.",
    "解谜推理":"Nintendo reference: Snipperclips' readable goals, experimentation, and more than one workable solution.",
    "创造表达":"Nintendo reference: Nintendo Labo's playful link between physical input, simple rules, and expressive output.",
    "合作社交":"Nintendo reference: Everybody 1-2-Switch! and Super Mario Party's shared-room communication games.",
    "动作竞赛":"Nintendo reference: Mario Kart's readable action, newcomer-friendly recovery, and exciting reversals."
  };
  const changes = {
    story:"Our version makes the mechanic part of the scene: success, recovery, and mistakes change character performance, dialogue, or the next story beat.",
    standalone:"Our version combines audio-first rules, companion reactions, and the distinct controls of Projector and Audio Story Box without copying Nintendo characters or presentation."
  };

  function englishItem(item) {
    const translated = entries[item.id] || [item.title, item.pitch];
    const ages = item.age.length === 1 ? item.age[0] : `${item.age[0].split("-")[0]}–${item.age[item.age.length - 1].split("-")[1]}`;
    return {
      ...item,
      title: translated[0],
      pitch: translated[1],
      category: category[item.category]?.[0] || item.category,
      impact: impact[item.impact] || item.impact,
      maturity: maturity[item.maturity] || item.maturity,
      capability: capability[item.capability] || item.capability,
      loop: loops[item.category] || item.loop,
      projector: "The 1024×576 projection carries the full scene, target, timing window, and immediate result. Players use direction, confirm/back, press/release, or motion when available.",
      box16: "Audio leads the cue and timing. The knob, Star, Moon, Home, light ring, and a bold 16×16 glyph carry the action and result.",
      ageNote: `Designed for ages ${ages}. Younger players get one clear action and generous timing; older players add sequences, feints, roles, or tighter windows.`,
      replay: replays[item.category] || item.replay,
      nintendo: references[item.category] || item.nintendo,
      change: changes[item.type] || changes.standalone
    };
  }

  window.AtlasI18n = { entries, category, impact, maturity, capability, players, metrics, englishItem };
})();
