import { PrismaClient, HeroRole, TierRank, CodeStatus } from "@prisma/client";

const prisma = new PrismaClient();

type HeroSeed = {
  slug: string;
  name: string;
  role: HeroRole;
  difficulty: number;
  summary: string;
  abilities: { name: string; description: string }[];
  counters: string[];
  tips: string[];
  tier: TierRank;
  tierNote: string;
};

const heroes: HeroSeed[] = [
  {
    slug: "venom",
    name: "Venom",
    role: "vanguard",
    difficulty: 2,
    summary:
      "A dive tank who leaps onto backlines, isolates supports, and creates chaotic space for your duelists.",
    abilities: [
      { name: "Tendril Swing", description: "Swing to engage or escape vertical angles." },
      { name: "Devour", description: "Sustain while pressuring a single target." },
      { name: "Feast of Symbiotes", description: "Ultimate that locks down a clustered group." },
    ],
    counters: ["Punisher", "Wolverine", "Hela"],
    tips: [
      "Engage after your team wins the first poke fight.",
      "Save swing for exit if the enemy still has cooldowns.",
    ],
    tier: "A",
    tierNote: "Strong dive initiator when paired with dive duelists.",
  },
  {
    slug: "magneto",
    name: "Magneto",
    role: "vanguard",
    difficulty: 3,
    summary:
      "A control tank who denies space with barriers and anti-projectile tools while enabling mid-range poke comps.",
    abilities: [
      { name: "Magnetic Barrier", description: "Block key damage windows for your backline." },
      { name: "Metal Storm", description: "Zone contested objectives." },
      { name: "Meteor M", description: "Ultimate for forcing enemies off high ground." },
    ],
    counters: ["Spider-Man", "Black Panther", "Iron Fist"],
    tips: [
      "Hold barrier for ultimate windows, not random poke.",
      "Play near cover so you can re-peek after denying a dive.",
    ],
    tier: "S",
    tierNote: "Premier peel tank for poke and hybrid comps.",
  },
  {
    slug: "groot",
    name: "Groot",
    role: "vanguard",
    difficulty: 2,
    summary:
      "A wall-building vanguard who reshapes chokes and protects supports during objective holds.",
    abilities: [
      { name: "Vine Wall", description: "Cut sightlines and stall pushes." },
      { name: "Thornlash", description: "Punish enemies who overextend into your walls." },
      { name: "Strangling Prison", description: "Ultimate crowd-control for teamfights." },
    ],
    counters: ["Punisher", "Hela", "Iron Man"],
    tips: [
      "Build walls to split the enemy tank from their supports.",
      "Do not wall yourself out of healing range.",
    ],
    tier: "A",
    tierNote: "Excellent on tight maps with clear chokes.",
  },
  {
    slug: "doctor-strange",
    name: "Doctor Strange",
    role: "vanguard",
    difficulty: 3,
    summary:
      "A portal-focused tank who creates aggressive flanks and emergency exits for coordinated teams.",
    abilities: [
      { name: "Portal", description: "Create unexpected angles or save a collapsing fight." },
      { name: "Shield of the Seraphim", description: "Absorb burst while your team repositions." },
      { name: "Eye of Agamotto", description: "Ultimate that turns a won fight into a wipe." },
    ],
    counters: ["Wolverine", "Punisher", "Hela"],
    tips: [
      "Call portal destinations before casting.",
      "Use portal as a defensive reset as often as an engage tool.",
    ],
    tier: "A",
    tierNote: "Skyrockets with voice comms and practiced routes.",
  },
  {
    slug: "hulk",
    name: "Hulk",
    role: "vanguard",
    difficulty: 2,
    summary:
      "A brawler tank who thrives in close-range slugfests and forces attention away from your damage dealers.",
    abilities: [
      { name: "Gamma Leap", description: "Close distance and disrupt formation." },
      { name: "Thunder Clap", description: "Create space and interrupt casts." },
      { name: "Hulk Smash", description: "Ultimate for cracking nested defensive setups." },
    ],
    counters: ["Punisher", "Magneto", "Luna Snow"],
    tips: [
      "Leap to the highest-value target only when peel is spent.",
      "Stay near your strategists after the first engage.",
    ],
    tier: "B",
    tierNote: "Solid frontline, weaker into heavy poke.",
  },
  {
    slug: "thor",
    name: "Thor",
    role: "vanguard",
    difficulty: 2,
    summary:
      "A hybrid frontliner who can threaten duelists while still contesting space on the objective.",
    abilities: [
      { name: "Mjolnir Throw", description: "Poke and confirm kills at mid range." },
      { name: "Awakening Rune", description: "Power spike for teamfight windows." },
      { name: "God of Thunder", description: "Ultimate that pressures clustered enemies." },
    ],
    counters: ["Wolverine", "Hela", "Punisher"],
    tips: [
      "Time Awakening with your supports' major cooldowns.",
      "Do not chase deep without a swing or leap partner.",
    ],
    tier: "B",
    tierNote: "Flexible fill tank when your team needs mixed threat.",
  },
  {
    slug: "spider-man",
    name: "Spider-Man",
    role: "duelist",
    difficulty: 4,
    summary:
      "A high-mobility assassin who deletes unsupported strategists and escapes before peel arrives.",
    abilities: [
      { name: "Web Swing", description: "Traverse vertically and disengage instantly." },
      { name: "Get Over Here", description: "Yank a priority target out of position." },
      { name: "Spectacular Spin", description: "Ultimate for multi-target chaos in the backline." },
    ],
    counters: ["Punisher", "Namor", "Scarlet Witch"],
    tips: [
      "Farm side angles before committing to the support line.",
      "Leave after one kill; greed loses more games than patience.",
    ],
    tier: "S",
    tierNote: "Highest ceiling dive duelist in the current meta.",
  },
  {
    slug: "hela",
    name: "Hela",
    role: "duelist",
    difficulty: 3,
    summary:
      "A hitscan poke duelist who wins long sightlines and punishes tanks that overstay in the open.",
    abilities: [
      { name: "Nightsword Thorn", description: "Primary poke that rewards tracking aim." },
      { name: "Soul Drainer", description: "Finish low targets and pressure shields." },
      { name: "Goddess of Death", description: "Ultimate for locking down a lane of travel." },
    ],
    counters: ["Spider-Man", "Black Panther", "Iron Fist"],
    tips: [
      "Hold high ground and force enemies into your crosshair.",
      "Swap angles after each ultimate window so dive cannot pre-aim you.",
    ],
    tier: "S",
    tierNote: "Best pure poke threat on open maps.",
  },
  {
    slug: "punisher",
    name: "The Punisher",
    role: "duelist",
    difficulty: 2,
    summary:
      "A turret-style damage dealer who melts tanks and denies dive with raw sustained firepower.",
    abilities: [
      { name: "Final Judgment", description: "Deployable damage spike for chokes." },
      { name: "Vantage", description: "Reposition and re-engage safely." },
      { name: "Culling Turret", description: "Ultimate that shreds stacked teams." },
    ],
    counters: ["Spider-Man", "Doctor Strange", "Storm"],
    tips: [
      "Set up behind your tank, not beside them.",
      "Save mobility for the dive that targets you, not for greed peeks.",
    ],
    tier: "A",
    tierNote: "Reliable anti-dive and anti-tank damage.",
  },
  {
    slug: "iron-man",
    name: "Iron Man",
    role: "duelist",
    difficulty: 3,
    summary:
      "An aerial artillery duelist who bombards formations and forces enemy hitscan to respect the sky.",
    abilities: [
      { name: "Repulsor Blast", description: "Mid-air poke and confirm tool." },
      { name: "Hyper Velocity", description: "Reposition above contested objectives." },
      { name: "Hulkbuster", description: "Ultimate for breaking entrenched defenses." },
    ],
    counters: ["Hela", "Punisher", "Hawkeye"],
    tips: [
      "Never fly the same pattern twice.",
      "Drop altitude when enemy hitscan ultimates are available.",
    ],
    tier: "A",
    tierNote: "Strong when enemy lacks dedicated hitscan.",
  },
  {
    slug: "wolverine",
    name: "Wolverine",
    role: "duelist",
    difficulty: 3,
    summary:
      "A relentless skirmisher who thrives in prolonged brawls and hunts isolated tanks or duelists.",
    abilities: [
      { name: "Berserk Slash", description: "Close-range pressure with sustain." },
      { name: "Feral Leap", description: "Gap closer onto priority targets." },
      { name: "Best There Is", description: "Ultimate that turns a duel into a guaranteed win." },
    ],
    counters: ["Luna Snow", "Invisible Woman", "Punisher"],
    tips: [
      "Take off-angle 1v1s instead of running into five players.",
      "Coordinate leap with a dive tank for free wins.",
    ],
    tier: "A",
    tierNote: "Excellent duelist into soft frontlines.",
  },
  {
    slug: "psylocke",
    name: "Psylocke",
    role: "duelist",
    difficulty: 3,
    summary:
      "A burst assassin who combines stealth angles with sharp cooldown trading in the enemy backline.",
    abilities: [
      { name: "Psi-Blade", description: "High burst melee confirm." },
      { name: "Psychic Veil", description: "Approach unseen and choose the first target." },
      { name: "Butterfly Projection", description: "Ultimate that deletes stacked supports." },
    ],
    counters: ["Namor", "Punisher", "Luna Snow"],
    tips: [
      "Reveal only when your team is already looking at the same fight.",
      "Abort if both enemy supports still have major cooldowns.",
    ],
    tier: "A",
    tierNote: "High impact into immobile backlines.",
  },
  {
    slug: "storm",
    name: "Storm",
    role: "duelist",
    difficulty: 3,
    summary:
      "A weather-controlling duelist who reshapes teamfight tempo with zone pressure and mobility.",
    abilities: [
      { name: "Wind Blade", description: "Consistent mid-range damage." },
      { name: "Weather Control", description: "Buff allies or deny enemy movement." },
      { name: "Omega Hurricane", description: "Ultimate that collapses clustered fights." },
    ],
    counters: ["Hela", "Punisher", "Hawkeye"],
    tips: [
      "Use weather windows to force objective commits.",
      "Do not stand still while channeling near enemy dive.",
    ],
    tier: "B",
    tierNote: "Map-dependent; shines on open objective spaces.",
  },
  {
    slug: "black-panther",
    name: "Black Panther",
    role: "duelist",
    difficulty: 4,
    summary:
      "A sticky dive duelist who chains dashes to delete one target and exit before the peel arrives.",
    abilities: [
      { name: "Spear Toss", description: "Mark and soften a target before dashing in." },
      { name: "Spirit Rend", description: "Dash combo for high single-target burst." },
      { name: "King of Wakanda", description: "Ultimate engage that starts a fight on your terms." },
    ],
    counters: ["Namor", "Punisher", "Scarlet Witch"],
    tips: [
      "Always pre-aim an exit path before the first dash.",
      "Target the weaker support first, not the tank.",
    ],
    tier: "A",
    tierNote: "Scary with practice; punishing when mistimed.",
  },
  {
    slug: "luna-snow",
    name: "Luna Snow",
    role: "strategist",
    difficulty: 2,
    summary:
      "A tempo support who converts song windows into massive team sustain and fight wins.",
    abilities: [
      { name: "Light & Dark Ice", description: "Flexible healing and damage tool.", },
      { name: "Share the Stage", description: "Link healing to a carry.", },
      { name: "Fate of Both Worlds", description: "Ultimate that flips losing fights." },
    ],
    counters: ["Spider-Man", "Psylocke", "Black Panther"],
    tips: [
      "Save ultimate for the second engage, not the first poke trade.",
      "Stand where dive must cross your tanks to reach you.",
    ],
    tier: "S",
    tierNote: "Meta defining support for most ranked compositions.",
  },
  {
    slug: "mantis",
    name: "Mantis",
    role: "strategist",
    difficulty: 2,
    summary:
      "A damage-amp strategist who turns accurate duelists into fight-ending threats.",
    abilities: [
      { name: "Healing Flower", description: "Reliable single-target sustain." },
      { name: "Allied Inspiration", description: "Damage boost for your best player." },
      { name: "Soul Resurrection", description: "Ultimate that recovers a lost teammate." },
    ],
    counters: ["Spider-Man", "Black Panther", "Iron Fist"],
    tips: [
      "Amp your strongest duelist during objective commits.",
      "Track enemy dive ultimates before standing wide.",
    ],
    tier: "A",
    tierNote: "Best when your team has a clear carry.",
  },
  {
    slug: "luna-invis",
    name: "Invisible Woman",
    role: "strategist",
    difficulty: 3,
    summary:
      "A utility support who shields, displaces, and creates safe pockets for poke and hybrid comps.",
    abilities: [
      { name: "Force Shield", description: "Deny burst on a priority ally." },
      { name: "Psionic Vortex", description: "Disrupt enemy formation." },
      { name: "Invisible Forcefield", description: "Ultimate zone that wins objective holds." },
    ],
    counters: ["Wolverine", "Punisher", "Hela"],
    tips: [
      "Use displacement to peel dive, not only to start fights.",
      "Ultimate on the point, not in a random side room.",
    ],
    tier: "S",
    tierNote: "Top-tier peel and objective utility.",
  },
  {
    slug: "adam-warlock",
    name: "Adam Warlock",
    role: "strategist",
    difficulty: 3,
    summary:
      "A revive-centric strategist who rewards disciplined positioning and coordinated re-engages.",
    abilities: [
      { name: "Quantum Magic", description: "Healing beam for focused sustain." },
      { name: "Soul Bond", description: "Share damage across allies in a clutch window." },
      { name: "Karmic Revival", description: "Ultimate that resets a lost fight." },
    ],
    counters: ["Hela", "Punisher", "Spider-Man"],
    tips: [
      "Play for the revive timing rather than greedy damage.",
      "Call when Soul Bond is available so tanks can over-extend safely.",
    ],
    tier: "B",
    tierNote: "Situational but devastating in coordinated stacks.",
  },
  {
    slug: "cloak-dagger",
    name: "Cloak & Dagger",
    role: "strategist",
    difficulty: 2,
    summary:
      "A dual-form support who blends area healing with opportunistic damage and escape tools.",
    abilities: [
      { name: "Light / Dark", description: "Swap between healing pressure and damage pressure." },
      { name: "Terror Cape", description: "Self-peel and reposition." },
      { name: "Eternal Bond", description: "Ultimate that stabilizes a collapsing fight." },
    ],
    counters: ["Hela", "Punisher", "Spider-Man"],
    tips: [
      "Default to healing form until the enemy commits.",
      "Use Terror Cape early against dive rather than after you are already dead.",
    ],
    tier: "A",
    tierNote: "Flexible support for solo queue.",
  },
  {
    slug: "rocket-raccoon",
    name: "Rocket Raccoon",
    role: "strategist",
    difficulty: 2,
    summary:
      "A mobile support who resurrects teammates and supplies burst healing from unexpected angles.",
    abilities: [
      { name: "Repair Mode", description: "Burst heal allies under pressure." },
      { name: "Jetpack Dash", description: "Escape dive and re-angle." },
      { name: "C.Y.A.", description: "Ultimate revive tool that resets a lost fight." },
    ],
    counters: ["Hela", "Punisher", "Storm"],
    tips: [
      "Hide revive beacons before the fight starts.",
      "Do not greed damage when your tanks are dry.",
    ],
    tier: "A",
    tierNote: "Strong solo-queue stabilizer.",
  },
];

async function main() {
  console.log("Seeding database...");

  await prisma.crawlRun.deleteMany();
  await prisma.tierEntry.deleteMany();
  await prisma.tierList.deleteMany();
  await prisma.redeemCode.deleteMany();
  await prisma.patch.deleteMany();
  await prisma.guide.deleteMany();
  await prisma.hero.deleteMany();
  await prisma.game.deleteMany();

  const marvel = await prisma.game.create({
    data: {
      slug: "marvel-rivals",
      name: "Marvel Rivals",
      description:
        "Team-based superhero shooter with seasonal balance patches, ranked meta shifts, and hero-specific tech.",
      officialUrl: "https://www.marvelrivals.com/",
      redeemUrl: null,
    },
  });

  const genshin = await prisma.game.create({
    data: {
      slug: "genshin-impact",
      name: "Genshin Impact",
      description: "Open-world action RPG with frequent livestream and event redeem codes.",
      officialUrl: "https://genshin.hoyoverse.com/",
      redeemUrl: "https://genshin.hoyoverse.com/en/gift",
    },
  });

  const hsr = await prisma.game.create({
    data: {
      slug: "honkai-star-rail",
      name: "Honkai: Star Rail",
      description: "Turn-based space fantasy RPG with version livestream codes and gift redemption.",
      officialUrl: "https://hsr.hoyoverse.com/",
      redeemUrl: "https://hsr.hoyoverse.com/gift",
    },
  });

  const wuwa = await prisma.game.create({
    data: {
      slug: "wuthering-waves",
      name: "Wuthering Waves",
      description: "Action open-world title with patch events and redeemable gift codes.",
      officialUrl: "https://wutheringwaves.kurogames.com/",
      redeemUrl: "https://wutheringwaves.kurogames.com/en/main",
    },
  });

  const createdHeroes = [];
  for (const hero of heroes) {
    const created = await prisma.hero.create({
      data: {
        gameId: marvel.id,
        slug: hero.slug === "luna-invis" ? "invisible-woman" : hero.slug,
        name: hero.name,
        role: hero.role,
        difficulty: hero.difficulty,
        summary: hero.summary,
        abilities: hero.abilities,
        counters: hero.counters,
        tips: hero.tips,
        sourceUrl: "https://www.marvelrivals.com/",
      },
    });
    createdHeroes.push({ ...created, tier: hero.tier, tierNote: hero.tierNote });
  }

  const tierList = await prisma.tierList.create({
    data: {
      gameId: marvel.id,
      title: "Marvel Rivals Competitive Tier List",
      mode: "Competitive",
      summary:
        "Our editorial competitive tier list for the current patch window. Rankings prioritize solo-queue consistency, ultimate value, and matchup flexibility—not just pro-play presence.",
    },
  });

  let sort = 0;
  for (const hero of createdHeroes) {
    await prisma.tierEntry.create({
      data: {
        tierListId: tierList.id,
        gameId: marvel.id,
        heroId: hero.id,
        tier: hero.tier,
        note: hero.tierNote,
        sortOrder: sort++,
      },
    });
  }

  const now = new Date();
  await prisma.patch.createMany({
    data: [
      {
        gameId: marvel.id,
        slug: "2026-07-balance-update",
        version: "2026.7.1",
        title: "July Competitive Balance Update",
        publishedAt: new Date("2026-07-15T16:00:00Z"),
        sourceUrl: "https://www.marvelrivals.com/",
        sourceName: "Marvel Rivals Official",
        summary:
          "A mid-season balance pass that softens the strongest poke tools, improves dive peel options, and tunes several strategist ultimates for clearer counterplay.",
        rankedImpact: [
          "Hela poke windows are slightly shorter, opening more dive routes.",
          "Luna Snow and Invisible Woman remain cornerstone supports.",
          "Tank barrier timings matter more after projectile sustain nerfs.",
        ],
        changelog: [
          { hero: "Hela", change: "Reduced primary fire uptime after consecutive crits." },
          { hero: "Magneto", change: "Barrier cooldown reduced in competitive modes." },
          { hero: "Spider-Man", change: "Web Swing horizontal momentum slightly increased." },
        ],
        rawBody:
          "Editorial summary generated from public patch messaging. Always verify final numbers on the official Marvel Rivals site.",
      },
      {
        gameId: marvel.id,
        slug: "2026-06-season-kickoff",
        version: "2026.6.0",
        title: "Season Kickoff Patch Notes",
        publishedAt: new Date("2026-06-20T16:00:00Z"),
        sourceUrl: "https://www.marvelrivals.com/",
        sourceName: "Marvel Rivals Official",
        summary:
          "Season kickoff adjustments focused on ranked matchmaking stability, quality-of-life HUD changes, and a first wave of hero tuning for the new map pool.",
        rankedImpact: [
          "Expect more hybrid comps as new map sightlines favor flexible rosters.",
          "Strategist priority stays high in the first weeks of the season.",
        ],
        changelog: [
          { hero: "Punisher", change: "Turret deploy delay reduced." },
          { hero: "Rocket Raccoon", change: "Revive beacon placement preview improved." },
        ],
        rawBody:
          "Editorial summary for season kickoff. Link out to official notes for the complete changelog.",
      },
    ],
  });

  await prisma.redeemCode.createMany({
    data: [
      {
        gameId: genshin.id,
        code: "GENSHINGIFT",
        rewards: "50 Primogems + 3 Hero's Wit (new players)",
        status: CodeStatus.active,
        sourceName: "Official / Editorial seed",
        sourceUrl: "https://genshin.hoyoverse.com/en/gift",
        needsReview: false,
        notes: "Long-running starter code. Verify on the official redemption page.",
        lastCheckedAt: now,
      },
      {
        gameId: genshin.id,
        code: "EZSB8889C2BZ",
        rewards: "Mora + Adventurer's Experience + Enhancement Ore + food",
        status: CodeStatus.active,
        sourceName: "Official livestream / Editorial seed",
        sourceUrl: "https://genshin.hoyoverse.com/en/gift",
        needsReview: true,
        notes: "Event window code — confirm before publishing as confirmed-active.",
        lastCheckedAt: now,
      },
      {
        gameId: genshin.id,
        code: "OLDSTREAM2025",
        rewards: "60 Primogems",
        status: CodeStatus.expired,
        sourceName: "Editorial seed",
        needsReview: false,
        lastCheckedAt: now,
        expiresAt: new Date("2025-12-01T00:00:00Z"),
      },
      {
        gameId: hsr.id,
        code: "STARRAILGIFT",
        rewards: "Stellar Jade + Traveler's Guides + materials",
        status: CodeStatus.active,
        sourceName: "Official / Editorial seed",
        sourceUrl: "https://hsr.hoyoverse.com/gift",
        needsReview: false,
        notes: "Permanent welcome code.",
        lastCheckedAt: now,
      },
      {
        gameId: hsr.id,
        code: "S395DJQU4HK",
        rewards: "60 Stellar Jade",
        status: CodeStatus.unconfirmed,
        sourceName: "Community signal / Editorial seed",
        sourceUrl: "https://hsr.hoyoverse.com/gift",
        needsReview: true,
        notes: "Marked unconfirmed until verification pass succeeds.",
        lastCheckedAt: now,
      },
      {
        gameId: hsr.id,
        code: "EXPIRED4XSTREAM",
        rewards: "30 Stellar Jade",
        status: CodeStatus.expired,
        sourceName: "Editorial seed",
        needsReview: false,
        lastCheckedAt: now,
        expiresAt: new Date("2026-07-04T00:00:00Z"),
      },
      {
        gameId: wuwa.id,
        code: "WUTHERINGWAVES",
        rewards: "Astrite + materials (verify in-client)",
        status: CodeStatus.active,
        sourceName: "Editorial seed",
        needsReview: true,
        notes: "Confirm redemption path in the current client build.",
        lastCheckedAt: now,
      },
      {
        gameId: wuwa.id,
        code: "KUROTHANKYOU",
        rewards: "Astrite pack",
        status: CodeStatus.expired,
        sourceName: "Editorial seed",
        needsReview: false,
        lastCheckedAt: now,
        expiresAt: new Date("2026-01-15T00:00:00Z"),
      },
    ],
  });

  await prisma.guide.createMany({
    data: [
      {
        gameId: marvel.id,
        slug: "marvel-rivals-beginner-guide",
        title: "Marvel Rivals Beginner Guide: First 10 Hours",
        excerpt:
          "Learn roles, settings, and the fastest way to stop throwing ranked games in your first week.",
        body: `## Who this guide is for

Brand-new Marvel Rivals players who want a clean foundation before grinding competitive.

## Start with roles, not skins

- **Vanguard:** create space and absorb attention.
- **Duelist:** convert space into kills.
- **Strategist:** keep the team alive through cooldown windows.

Pick one hero in each role and learn their escape tool first. Damage numbers come later.

## Settings that matter

1. Turn on a clear ally outline color.
2. Lower unnecessary visual noise in the graphics menu.
3. Bind your mobility ability somewhere you can hit under panic.

## Ranked checklist

- Queue with at least one flexible role.
- Track enemy support ultimates.
- Stop chasing after one kill if your team is not with you.

## What to practice next

After ten hours, review our [competitive tier list](/marvel-rivals/tier-list) and pick one S-tier or A-tier hero that matches your aim style.`,
        publishedAt: new Date("2026-07-10T12:00:00Z"),
      },
      {
        gameId: marvel.id,
        slug: "marvel-rivals-ranked-climb",
        title: "Marvel Rivals Ranked Climb Guide",
        excerpt:
          "A practical climb plan focused on hero pools, cooldown tracking, and avoiding common solo-queue traps.",
        body: `## Climb philosophy

Winning ranked in Marvel Rivals is less about perfect aim and more about fighting on your terms.

## Build a three-hero pool

1. One comfort duelist.
2. One peel-oriented strategist.
3. One flexible vanguard.

If your team already locked two duelists, you should be ready to play strategist without tilting.

## Fight math

Before every engage, ask:

- Do we have a support ultimate?
- Did they already spend peel?
- Is the objective timer actually forcing a fight?

If the answer is no to all three, wait.

## Review loop

After each loss streak, review one replay for positioning only. Ignore highlight kills until your deaths drop.

## Resources

- Live patch impact: [patch notes](/marvel-rivals/patch-notes)
- Current meta snapshot: [tier list](/marvel-rivals/tier-list)`,
        publishedAt: new Date("2026-07-12T12:00:00Z"),
      },
      {
        gameId: marvel.id,
        slug: "how-to-beat-dive-comps",
        title: "How to Beat Dive Comps in Marvel Rivals",
        excerpt:
          "Counter Spider-Man, Black Panther, and friends with positioning, peel priorities, and the right hero swaps.",
        body: `## What dive wants

Dive comps want an isolated strategist and a late peel response.

## Defensive setup

- Place supports behind cover with two exit routes.
- Keep one vanguard near the backline instead of always hard-engaging.
- Assign one duelist to look back on the first swing.

## Strong anti-dive picks

- Punisher for raw denial.
- Namor-style zone tools when available in your roster.
- Invisible Woman / Luna Snow for panic sustain windows.

## Ultimate discipline

Do not panic-ultimate the moment a diver appears. Wait until the second engager commits, then blow the fight-winning support ultimate.

## Next reads

Check individual matchup notes on each [hero page](/marvel-rivals/tier-list).`,
        publishedAt: new Date("2026-07-18T12:00:00Z"),
      },
    ],
  });

  console.log(
    `Seeded ${createdHeroes.length} heroes, tier list, patches, codes, and guides.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
