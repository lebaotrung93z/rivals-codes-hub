import { GuideLevel, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type GuideSeed = {
  slug: string;
  title: string;
  excerpt: string;
  level: GuideLevel;
  sortOrder: number;
  body: string;
};

function section(title: string, paragraphs: string[]) {
  return `## ${title}\n\n${paragraphs.join("\n\n")}`;
}

const marvelGuides: GuideSeed[] = [
  {
    slug: "marvel-rivals-beginner-01-what-is-the-game",
    title: "Beginner 1: What Marvel Rivals Is (and How Matches Work)",
    excerpt: "Learn roles, win conditions, and what a normal match looks like before you touch ranked.",
    level: "beginner",
    sortOrder: 1,
    body: [
      section("Goal of this lesson", [
        "Finish this page knowing how a Marvel Rivals match is won, what the three roles do, and what you should ignore as a brand-new player.",
      ]),
      section("The three roles", [
        "- **Vanguard:** creates space, absorbs attention, and starts or stops engages.",
        "- **Duelist:** converts space into eliminations.",
        "- **Strategist:** keeps the team alive through cooldown windows and fight-turning ultimates.",
        "You do not need every hero. You need one comfort pick per role eventually — start with one role first.",
      ]),
      section("How fights are usually decided", [
        "Most rounds are not won by raw aim alone. They are won by **who spends ultimates first**, who gets isolated, and who holds the objective when the timer forces a fight.",
        "As a beginner, your job is simple: stay with your team, use cover, and do not chase a kill into a spawn room.",
      ]),
      section("Practice assignment", [
        "1. Play three Quick Play games on one hero.",
        "2. After each game, write one sentence: “I died because …”",
        "3. Tomorrow, pick the death reason that appeared twice and fix only that.",
      ]),
      section("Next guide", [
        "Continue with [Beginner 2: Controls, settings, and comfort setup](/guides/marvel-rivals-beginner-02-controls-settings).",
      ]),
    ].join("\n\n"),
  },
  {
    slug: "marvel-rivals-beginner-02-controls-settings",
    title: "Beginner 2: Controls, Settings, and Comfort Setup",
    excerpt: "Build a stable settings baseline so learning heroes is not fighting your mouse and HUD.",
    level: "beginner",
    sortOrder: 2,
    body: [
      section("Goal of this lesson", [
        "Leave with a settings checklist that reduces panic mistakes: clear outlines, usable binds, and a sensitivity you can repeat.",
      ]),
      section("Must-fix settings", [
        "1. Ally outline color that is obvious in every map.",
        "2. Mobility / escape ability on a bind you can hit under stress.",
        "3. Lower visual clutter if you lose enemies in effects.",
        "4. Keep one sensitivity for a full week before changing it again.",
      ]),
      section("Warm-up that actually helps", [
        "- Two minutes of free look and camera height comfort.",
        "- Two minutes of ability confirms in practice/custom.",
        "- One deathmatch or quick play focused only on not overextending.",
      ]),
      section("Common beginner trap", [
        "Changing sensitivity every loss. That resets your muscle memory and hides the real problem (positioning).",
      ]),
      section("Next guide", [
        "Go to [Beginner 3: Your first 10 hours roadmap](/guides/marvel-rivals-beginner-03-first-10-hours).",
      ]),
    ].join("\n\n"),
  },
  {
    slug: "marvel-rivals-beginner-03-first-10-hours",
    title: "Beginner 3: First 10 Hours Roadmap",
    excerpt: "A hour-by-hour plan so new players stop feeling lost in the roster and map pool.",
    level: "beginner",
    sortOrder: 3,
    body: [
      section("Hours 0–2", [
        "Pick **one** hero. Learn only: primary fire, escape tool, and ultimate timing. Ignore the rest of the roster.",
      ]),
      section("Hours 2–5", [
        "Play objective-focused. After each fight ask: were you on the cart/point when it mattered? If not, you were farming side fights.",
      ]),
      section("Hours 5–10", [
        "Add a second hero in a different role. Now you can flex when your team already locked two duelists.",
      ]),
      section("Checkpoint", [
        "You are ready for intermediate guides when you can explain why you died in most fights without blaming teammates first.",
      ]),
      section("Hub links", [
        "- Browse the [tier list](/marvel-rivals/tier-list) only after hour 5.",
        "- Skim [patch notes](/marvel-rivals/patch-notes) so you know the game is live-service.",
      ]),
      section("Next guide", [
        "[Beginner 4: How to die less](/guides/marvel-rivals-beginner-04-die-less).",
      ]),
    ].join("\n\n"),
  },
  {
    slug: "marvel-rivals-beginner-04-die-less",
    title: "Beginner 4: How to Die Less",
    excerpt: "Positioning rules that cut feed deaths before you worry about fancy combos.",
    level: "beginner",
    sortOrder: 4,
    body: [
      section("Three survival rules", [
        "1. Fight from cover edges, not open mid.",
        "2. If your strategist is dead, play safe until they respawn.",
        "3. One kill is enough — greed for the second kill is how stomps start.",
      ]),
      section("Role-specific notes", [
        "- **Vanguard:** do not dive alone without a follow-up.",
        "- **Duelist:** take off-angles that still have an exit.",
        "- **Strategist:** stand where dive must cross your tank to reach you.",
      ]),
      section("Drill", [
        "Play two games where your only scoreboard goal is fewer deaths than last game — not more kills.",
      ]),
      section("Next guide", [
        "[Beginner 5: Reading the objective timer](/guides/marvel-rivals-beginner-05-objective-timer).",
      ]),
    ].join("\n\n"),
  },
  {
    slug: "marvel-rivals-beginner-05-objective-timer",
    title: "Beginner 5: Objective Timer and When to Fight",
    excerpt: "Stop taking random fights — learn which clocks force a commit.",
    level: "beginner",
    sortOrder: 5,
    body: [
      section("Core idea", [
        "If the objective is not forcing a fight, you can wait for cooldowns and numbers. Beginners lose by fighting early for ego.",
      ]),
      section("Before you engage, ask", [
        "1. Do we have a support ultimate?",
        "2. Did they already spend peel?",
        "3. Is the timer actually forcing this fight?",
        "If all answers are no, wait.",
      ]),
      section("Graduation", [
        "When these five beginner guides feel obvious, move to intermediate: [Build a three-hero pool](/guides/marvel-rivals-intermediate-01-hero-pool).",
      ]),
    ].join("\n\n"),
  },
  {
    slug: "marvel-rivals-intermediate-01-hero-pool",
    title: "Intermediate 1: Build a Three-Hero Pool",
    excerpt: "Create a flexible ranked pool: one duelist, one strategist, one vanguard answer.",
    level: "intermediate",
    sortOrder: 11,
    body: [
      section("Why three heroes", [
        "One-trick players stall when the enemy hard-counters them or when the team already filled their role. A three-hero pool keeps you useful every queue.",
      ]),
      section("How to choose", [
        "1. Comfort duelist you can aim on.",
        "2. Peel-oriented strategist for losing drafts.",
        "3. Flexible vanguard that can hold space without needing perfect teammates.",
        "Use the [tier list](/marvel-rivals/tier-list) as a shortlist, not a prison.",
      ]),
      section("Practice plan", [
        "Play a week where two of every three games must be on your non-main. Track win rate only after 15 games on each.",
      ]),
      section("Next", [
        "[Intermediate 2: Cooldown tracking](/guides/marvel-rivals-intermediate-02-cooldown-tracking).",
      ]),
    ].join("\n\n"),
  },
  {
    slug: "marvel-rivals-intermediate-02-cooldown-tracking",
    title: "Intermediate 2: Cooldown Tracking",
    excerpt: "Track enemy peel and mobility so your engages stop being random.",
    level: "intermediate",
    sortOrder: 12,
    body: [
      section("What to track first", [
        "Do not track everything. Start with: enemy support major cooldown, enemy dive mobility, and your own escape.",
      ]),
      section("In-fight habit", [
        "Call (even to yourself): “peel down” when their defensive tool is spent. That is your engage window.",
      ]),
      section("Drill", [
        "In three games, die only after writing which cooldown you ignored. Pattern recognition beats mechanical panic.",
      ]),
      section("Next", [
        "[Intermediate 3: Ultimate economy](/guides/marvel-rivals-intermediate-03-ultimate-economy).",
      ]),
    ].join("\n\n"),
  },
  {
    slug: "marvel-rivals-intermediate-03-ultimate-economy",
    title: "Intermediate 3: Ultimate Economy",
    excerpt: "Win more by spending ultimates on purpose — not as panic buttons.",
    level: "intermediate",
    sortOrder: 13,
    body: [
      section("Rules of thumb", [
        "- Do not mirror ultimates automatically.",
        "- Save fight-winning support ultimates for the second engage when possible.",
        "- If you win the fight with abilities only, keep the ultimate for the next forced objective.",
      ]),
      section("Common throw", [
        "Burning a support ultimate the moment a diver appears — before the rest of the enemy commits. Wait for the real engage.",
      ]),
      section("Next", [
        "[Intermediate 4: Dive vs poke vs brawl](/guides/marvel-rivals-intermediate-04-comp-styles).",
      ]),
    ].join("\n\n"),
  },
  {
    slug: "marvel-rivals-intermediate-04-comp-styles",
    title: "Intermediate 4: Dive vs Poke vs Brawl",
    excerpt: "Identify the match style in the first 30 seconds and play the correct tempo.",
    level: "intermediate",
    sortOrder: 14,
    body: [
      section("Quick reads", [
        "- **Dive:** high mobility, wants isolated supports.",
        "- **Poke:** long sightlines, wants shield breaks and chip damage.",
        "- **Brawl:** close-range slugfests, wants nested cooldowns and midfight resets.",
      ]),
      section("What you should do", [
        "If they are dive, assign peel and play closer. If they are poke, stop standing in open mid. If they are brawl, hold cooldowns for the second swing.",
      ]),
      section("Next", [
        "[Intermediate 5: Solo-queue climb habits](/guides/marvel-rivals-intermediate-05-solo-queue).",
      ]),
    ].join("\n\n"),
  },
  {
    slug: "marvel-rivals-intermediate-05-solo-queue",
    title: "Intermediate 5: Solo-Queue Climb Habits",
    excerpt: "A practical climb loop for players without a fixed five-stack.",
    level: "intermediate",
    sortOrder: 15,
    body: [
      section("Session structure", [
        "1. Warm up.",
        "2. Play three focused games on one habit.",
        "3. Stop or review — do not doom-queue while tilted.",
      ]),
      section("Review loop", [
        "After a loss streak, review one replay for positioning only. Ignore highlight kills until deaths drop.",
      ]),
      section("Graduation to advanced", [
        "When you can flex roles and explain fight tempo, continue to [Advanced 1: Teamfight scripts](/guides/marvel-rivals-advanced-01-teamfight-scripts).",
      ]),
    ].join("\n\n"),
  },
  {
    slug: "marvel-rivals-advanced-01-teamfight-scripts",
    title: "Advanced 1: Teamfight Scripts",
    excerpt: "Pre-plan first engage, convert, and reset instead of improvising every fight.",
    level: "advanced",
    sortOrder: 21,
    body: [
      section("A simple script", [
        "1. **Setup:** claim high ground / off-angle before the timer.",
        "2. **First engage:** one tank threaten + one duelist look for a pick.",
        "3. **Convert:** spend support ultimate only if the fight is winnable.",
        "4. **Reset:** if you get one pick, regroup — do not stagger.",
      ]),
      section("Shotcall lite", [
        "Even without voice, use pings for “group”, “fallback”, and “ultimate ready”. Clear defaults beat silence.",
      ]),
      section("Next", [
        "[Advanced 2: Counter-swapping](/guides/marvel-rivals-advanced-02-counter-swapping).",
      ]),
    ].join("\n\n"),
  },
  {
    slug: "marvel-rivals-advanced-02-counter-swapping",
    title: "Advanced 2: Counter-Swapping Without Throwing Ultimates",
    excerpt: "Know when a swap is worth the ultimate tax — and when it is ego.",
    level: "advanced",
    sortOrder: 22,
    body: [
      section("Swap when", [
        "- You are hard-countered for two full fights in a row.",
        "- Your ultimate is low value anyway.",
        "- The objective reset gives you time to come back with a better tool.",
      ]),
      section("Do not swap when", [
        "You are one fight from a win and your ultimate is charged for a clean convert.",
      ]),
      section("Next", [
        "[Advanced 3: Anti-dive systems](/guides/marvel-rivals-advanced-03-anti-dive).",
      ]),
    ].join("\n\n"),
  },
  {
    slug: "marvel-rivals-advanced-03-anti-dive",
    title: "Advanced 3: Anti-Dive Systems",
    excerpt: "Build peel assignments, crossfires, and ultimate discipline against Spider-Man style engages.",
    level: "advanced",
    sortOrder: 23,
    body: [
      section("Defensive setup", [
        "- Supports with two exit routes.",
        "- One vanguard near the backline.",
        "- One duelist assigned to look back on the first swing.",
      ]),
      section("Ultimate discipline", [
        "Do not panic-ultimate the first diver. Wait until the second engager commits, then blow the fight-winning support ultimate.",
      ]),
      section("Related", [
        "Also read [How to Beat Dive Comps](/guides/how-to-beat-dive-comps) and individual [hero pages](/marvel-rivals/tier-list).",
      ]),
      section("Next", [
        "[Advanced 4: Patch adaptation](/guides/marvel-rivals-advanced-04-patch-adaptation).",
      ]),
    ].join("\n\n"),
  },
  {
    slug: "marvel-rivals-advanced-04-patch-adaptation",
    title: "Advanced 4: Patch Adaptation",
    excerpt: "Turn balance patches into a 48-hour testing plan instead of vibes.",
    level: "advanced",
    sortOrder: 24,
    body: [
      section("48-hour plan", [
        "1. Read the [patch notes](/marvel-rivals/patch-notes) ranked-impact bullets.",
        "2. Test your main for three games before declaring it dead.",
        "3. Update your pool using the [tier list](/marvel-rivals/tier-list) after you have real reps.",
      ]),
      section("Advanced mastery", [
        "When fundamentals are stable, study per-hero mastery guides linked from the tier list hero pages.",
      ]),
      section("Next", [
        "[Advanced 5: Review like a coach](/guides/marvel-rivals-advanced-05-vod-review).",
      ]),
    ].join("\n\n"),
  },
  {
    slug: "marvel-rivals-advanced-05-vod-review",
    title: "Advanced 5: VOD Review Like a Coach",
    excerpt: "A repeatable review template that turns losses into permanent upgrades.",
    level: "advanced",
    sortOrder: 25,
    body: [
      section("20-minute template", [
        "1. Watch only your deaths first (8 minutes).",
        "2. Tag each death: positioning / cooldown / greed / info (6 minutes).",
        "3. Pick one tag that appears most and design tomorrow’s focus (6 minutes).",
      ]),
      section("Do not review", [
        "Teammate mistakes you cannot control. Review is for your decision quality.",
      ]),
      section("Path complete", [
        "You now have a beginner → advanced play path. Return to earlier lessons when a bad habit returns — that is normal.",
      ]),
    ].join("\n\n"),
  },
];

const genshinGuides: GuideSeed[] = [
  {
    slug: "genshin-beginner-01-start",
    title: "Genshin Beginner 1: First Steps in Teyvat",
    excerpt: "World level, exploration basics, and what to prioritize in your first week.",
    level: "beginner",
    sortOrder: 1,
    body: [
      section("First week priorities", [
        "Follow the Archon Quest enough to unlock systems, explore for chests/waypoints, and build **one** on-field DPS plus a healer before chasing every character.",
      ]),
      section("Avoid", [
        "Spending fragile resin randomly and ascending World Level before your characters can clear content.",
      ]),
      section("Next", [
        "[Genshin Beginner 2: Combat and elements](/guides/genshin-beginner-02-combat).",
      ]),
    ].join("\n\n"),
  },
  {
    slug: "genshin-beginner-02-combat",
    title: "Genshin Beginner 2: Combat and Elemental Reactions",
    excerpt: "Learn the reactions that actually matter for early teams.",
    level: "beginner",
    sortOrder: 2,
    body: [
      section("Core reactions to know", [
        "Start with Melt/Vaporize style damage or a simple Electro-Charged/Bloom-friendly pair depending on your roster. Consistency beats perfect theorycraft at AR 20–35.",
      ]),
      section("Next", [
        "[Genshin Intermediate 1: Team building](/guides/genshin-intermediate-01-teams).",
      ]),
    ].join("\n\n"),
  },
  {
    slug: "genshin-intermediate-01-teams",
    title: "Genshin Intermediate 1: Team Building",
    excerpt: "Build two flexible teams for domains and early Spiral Abyss.",
    level: "intermediate",
    sortOrder: 11,
    body: [
      section("Template", [
        "DPS + battery/support + buffer/shielder + flex. Level talents on the DPS first, then supports that reduce rotation friction.",
      ]),
      section("Next", [
        "[Genshin Advanced 1: Spiral Abyss planning](/guides/genshin-advanced-01-abyss).",
      ]),
    ].join("\n\n"),
  },
  {
    slug: "genshin-advanced-01-abyss",
    title: "Genshin Advanced 1: Spiral Abyss Planning",
    excerpt: "Plan two teams, energy needs, and chamber checks like an endgame player.",
    level: "advanced",
    sortOrder: 21,
    body: [
      section("Process", [
        "Read chamber mechanics first, assign teams to halves, then practice rotations until first-rotation energy is stable.",
      ]),
      section("Codes tip", [
        "Keep Primogem codes handy on our [Genshin codes page](/codes/genshin-impact) during version livestreams — but build skill first.",
      ]),
    ].join("\n\n"),
  },
];

const hsrGuides: GuideSeed[] = [
  {
    slug: "hsr-beginner-01-basics",
    title: "Star Rail Beginner 1: Turn-Based Basics",
    excerpt: "Speed, skill points, and what to upgrade first on the Astral Express.",
    level: "beginner",
    sortOrder: 1,
    body: [
      section("Learn these systems first", [
        "Skill Point economy, Speed tuning basics, and building one clear-main DPS with a sustain unit. Do not spread relics across eight characters early.",
      ]),
      section("Next", [
        "[Star Rail Intermediate 1: Team archetypes](/guides/hsr-intermediate-01-teams).",
      ]),
    ].join("\n\n"),
  },
  {
    slug: "hsr-intermediate-01-teams",
    title: "Star Rail Intermediate 1: Team Archetypes",
    excerpt: "Hypercarry vs follow-up vs break-oriented teams explained simply.",
    level: "intermediate",
    sortOrder: 11,
    body: [
      section("Pick one archetype", [
        "Commit to one clear team identity so your relic farming has a target. Switch archetypes only after you can clear current MoC comfort content.",
      ]),
      section("Next", [
        "[Star Rail Advanced 1: Endgame cycles](/guides/hsr-advanced-01-endgame).",
      ]),
    ].join("\n\n"),
  },
  {
    slug: "hsr-advanced-01-endgame",
    title: "Star Rail Advanced 1: Endgame Cycle Planning",
    excerpt: "Plan Memory of Chaos / endgame clears around speed breakpoints and energy.",
    level: "advanced",
    sortOrder: 21,
    body: [
      section("Advanced checklist", [
        "Confirm speed breakpoints, zero-cycle ambitions only after consistency, and keep a second team ready for split content.",
      ]),
      section("Codes", [
        "Redeem Jade codes on the [HSR codes page](/codes/honkai-star-rail) — then invest in the team you actually play.",
      ]),
    ].join("\n\n"),
  },
];

const wuwaGuides: GuideSeed[] = [
  {
    slug: "wuwa-beginner-01-combat",
    title: "Wuthering Waves Beginner 1: Combat Feel",
    excerpt: "Dodges, intro/outro skills, and building your first comfortable rotator.",
    level: "beginner",
    sortOrder: 1,
    body: [
      section("First skills to learn", [
        "Perfect dodge timing, when to swap for intro skills, and keeping one sustain option while you learn maps.",
      ]),
      section("Next", [
        "[WuWa Intermediate 1: Echoes and builds](/guides/wuwa-intermediate-01-echoes).",
      ]),
    ].join("\n\n"),
  },
  {
    slug: "wuwa-intermediate-01-echoes",
    title: "Wuthering Waves Intermediate 1: Echoes and Builds",
    excerpt: "Farm and slot echoes with a purpose instead of infinite inventory chaos.",
    level: "intermediate",
    sortOrder: 11,
    body: [
      section("Build discipline", [
        "Pick a main DPS echo set target and finish that character before spreading materials across the whole roster.",
      ]),
      section("Next", [
        "[WuWa Advanced 1: Boss and endgame routing](/guides/wuwa-advanced-01-endgame).",
      ]),
    ].join("\n\n"),
  },
  {
    slug: "wuwa-advanced-01-endgame",
    title: "Wuthering Waves Advanced 1: Boss and Endgame Routing",
    excerpt: "Route bosses, optimize rotations, and prepare for harder tower-style content.",
    level: "advanced",
    sortOrder: 21,
    body: [
      section("Advanced focus", [
        "Learn boss telegraphs, keep a second team for multi-room content, and track patch changes that reshuffle echo value.",
      ]),
      section("Codes", [
        "Use the [Wuthering Waves codes page](/codes/wuthering-waves) for Astrite — skill still clears endgame.",
      ]),
    ].join("\n\n"),
  },
];

async function upsertGuides(gameId: string, guides: GuideSeed[]) {
  for (const g of guides) {
    await prisma.guide.upsert({
      where: { slug: g.slug },
      create: {
        gameId,
        slug: g.slug,
        title: g.title,
        excerpt: g.excerpt,
        body: g.body,
        level: g.level,
        sortOrder: g.sortOrder,
        publishedAt: new Date(),
      },
      update: {
        title: g.title,
        excerpt: g.excerpt,
        body: g.body,
        level: g.level,
        sortOrder: g.sortOrder,
        gameId,
      },
    });
  }
}

async function heroMasteryGuides(gameId: string) {
  const heroes = await prisma.hero.findMany({
    where: { gameId },
    orderBy: { name: "asc" },
  });
  let order = 100;
  for (const hero of heroes) {
    const slug = `${hero.slug}-play-mastery`;
    await prisma.guide.upsert({
      where: { slug },
      create: {
        gameId,
        slug,
        title: `Advanced Mastery: How to Play ${hero.name}`,
        excerpt: `Advanced ${hero.name} playbook — identity, drills, matchups, and ranked checklist.`,
        level: "advanced",
        sortOrder: order++,
        body: [
          section("Who this is for", [
            `Players who already finished the beginner and intermediate Marvel Rivals path and want deeper ${hero.name} mastery.`,
          ]),
          section("Identity", [hero.summary]),
          section("Practice first", [
            "1. Escape/peel tool under pressure.",
            "2. One confirmed engage pattern.",
            "3. Ultimate convert rules.",
          ]),
          section("Tips", hero.tips.map((t) => `- ${t}`)),
          section("Respect these matchups", [
            hero.counters.join(", "),
          ]),
          section("Open the full hero doc", [
            `[${hero.name} hero page](/marvel-rivals/heroes/${hero.slug}) · [Tier list](/marvel-rivals/tier-list)`,
          ]),
        ].join("\n\n"),
      },
      update: {
        title: `Advanced Mastery: How to Play ${hero.name}`,
        excerpt: `Advanced ${hero.name} playbook — identity, drills, matchups, and ranked checklist.`,
        level: "advanced",
        sortOrder: order - 1,
        body: [
          section("Who this is for", [
            `Players who already finished the beginner and intermediate Marvel Rivals path and want deeper ${hero.name} mastery.`,
          ]),
          section("Identity", [hero.summary]),
          section("Practice first", [
            "1. Escape/peel tool under pressure.",
            "2. One confirmed engage pattern.",
            "3. Ultimate convert rules.",
          ]),
          section("Tips", hero.tips.map((t) => `- ${t}`)),
          section("Respect these matchups", [hero.counters.join(", ")]),
          section("Open the full hero doc", [
            `[${hero.name} hero page](/marvel-rivals/heroes/${hero.slug}) · [Tier list](/marvel-rivals/tier-list)`,
          ]),
        ].join("\n\n"),
      },
    });
  }
}

async function main() {
  console.log("Rebuilding play guides (beginner → advanced)...");

  // Remove path spam / non-play guides, but keep hero how-to-play docs
  await prisma.guide.deleteMany({
    where: { NOT: { slug: { endsWith: "-how-to-play" } } },
  });

  const marvel = await prisma.game.findUniqueOrThrow({ where: { slug: "marvel-rivals" } });
  const genshin = await prisma.game.findUniqueOrThrow({ where: { slug: "genshin-impact" } });
  const hsr = await prisma.game.findUniqueOrThrow({ where: { slug: "honkai-star-rail" } });
  const wuwa = await prisma.game.findUniqueOrThrow({ where: { slug: "wuthering-waves" } });

  // Keep a couple of classic named guides as aliases in the path
  const extras: GuideSeed[] = [
    {
      slug: "marvel-rivals-beginner-guide",
      title: "Beginner Path Overview: How to Play Marvel Rivals",
      excerpt: "Start here — the full beginner → advanced roadmap in one page.",
      level: "beginner",
      sortOrder: 0,
      body: [
        section("Your learning path", [
          "1. [What the game is](/guides/marvel-rivals-beginner-01-what-is-the-game)",
          "2. [Controls & settings](/guides/marvel-rivals-beginner-02-controls-settings)",
          "3. [First 10 hours](/guides/marvel-rivals-beginner-03-first-10-hours)",
          "4. [Die less](/guides/marvel-rivals-beginner-04-die-less)",
          "5. [Objective timer](/guides/marvel-rivals-beginner-05-objective-timer)",
          "Then intermediate pool/cooldowns/ultimates/comps/solo-queue, then advanced teamfights, counters, anti-dive, patches, and VOD review.",
        ]),
        section("How to use this hub", [
          "Follow guides **in order**. Do not jump to advanced hero mastery until intermediate habits stick.",
        ]),
      ].join("\n\n"),
    },
  ];

  await upsertGuides(marvel.id, [...extras, ...marvelGuides]);
  // Hero how-to-play guides are imported via: npm run db:hero-guides
  await upsertGuides(genshin.id, genshinGuides);
  await upsertGuides(hsr.id, hsrGuides);
  await upsertGuides(wuwa.id, wuwaGuides);

  const grouped = await prisma.guide.groupBy({
    by: ["level"],
    _count: true,
  });
  console.log("By level:", grouped);
  const total = await prisma.guide.count();
  console.log("Total play guides:", total);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
