/**
 * Build original how-to-play guides for every Marvel Rivals hero.
 * Structure: overview → kit → play → comps → counters.
 */
import "dotenv/config";
import { PrismaClient, HeroRole } from "@prisma/client";

const prisma = new PrismaClient();

const ROLE_LABEL: Record<HeroRole, string> = {
  duelist: "Duelist (DPS)",
  strategist: "Strategist (Support)",
  vanguard: "Vanguard (Tank)",
};

const ROLE_PLAY: Record<HeroRole, string[]> = {
  duelist: [
    "Win your lane or off-angle before the main fight collapses.",
    "Spend mobility to take a kill or escape—never both greedily.",
    "Ultimate after peels are used, not into a full cooldown stack.",
  ],
  strategist: [
    "Heal priority: diving tanks and collapsing duelists first.",
    "Save peel tools for enemy ultimates and dive windows.",
    "Stand where you can see your tanks without standing on the same sightline as enemy poke.",
  ],
  vanguard: [
    "Create space; do not chase kills past support line of sight.",
    "Hold your strongest cooldown for the enemy's engage, not chip damage.",
    "Call when you are committing so duelists and supports can follow.",
  ],
};

function section(title: string, lines: string[]) {
  return `## ${title}\n\n${lines.join("\n")}`;
}

function compsFor(role: HeroRole, name: string): string[] {
  if (role === "duelist") {
    return [
      `- Pair ${name} with a peel-heavy strategist (Rocket, Invisible Woman, Cloak & Dagger) so you can take aggressive angles.`,
      `- Prefer a dive or brawl vanguard (Venom, Thor, Hulk) if ${name} wants close fights; use Magneto/Strange for poke comps.`,
      `- Second duelist should cover what ${name} lacks—anti-dive if you are a sniper, or poke if you are a diver.`,
    ];
  }
  if (role === "strategist") {
    return [
      `- Stack ${name} with a second strategist who covers the opposite job (burst heal vs peel vs revive).`,
      `- Frontline: durable tanks that stay in your LOS (Thing, Thor, Groot) beat greed-dive tanks for most supports.`,
      `- Enable one clear carry duelist—do not split heals across three random damage dealers.`,
    ];
  }
  return [
    `- Support ${name} with at least one peel strategist so dives cannot ignore you.`,
    `- Bring a duelist who plays the same tempo (dive with dive, poke with poke).`,
    `- Second tank should fill gaps—barrier if you are a brawler, or dive if you are a hold tank.`,
  ];
}

function buildBody(hero: {
  name: string;
  slug: string;
  role: HeroRole;
  difficulty: number;
  summary: string;
  tips: string[];
  counters: string[];
  abilities: { name: string; description: string }[];
}) {
  const abilities = hero.abilities.length
    ? hero.abilities.map((a) => `- **${a.name}** — ${a.description}`)
    : ["- Check the in-game hero page for the latest ability numbers."];

  const tips = hero.tips.length
    ? hero.tips.map((t) => `- ${t}`)
    : ROLE_PLAY[hero.role].map((t) => `- ${t}`);

  const counters = hero.counters.length
    ? hero.counters.map((c) => `- ${c}`)
    : ["- Long-range poke and stacked peels usually punish greedy engages."];

  return [
    section(`${hero.name} overview`, [
      `${hero.name} is a **${ROLE_LABEL[hero.role]}** (difficulty ${hero.difficulty}/5).`,
      "",
      hero.summary,
      "",
      "This guide is an original how-to-play breakdown: identity, kit, fight plan, team ideas, and counters. Ability numbers change every patch—confirm live values in-game.",
    ]),
    section("Kit and abilities", [
      "Core tools to internalize first:",
      "",
      ...abilities,
    ]),
    section(`How to play ${hero.name}`, [
      "### Fight plan",
      ...ROLE_PLAY[hero.role].map((t) => `- ${t}`),
      "",
      "### Practical tips",
      ...tips,
      "",
      "### Positioning",
      hero.role === "duelist"
        ? `- Take off-angles and flanks. ${hero.name} should rarely stand on the same main sightline as your tanks unless you are holding a choke.`
        : hero.role === "strategist"
          ? `- Stay one cover piece behind your tanks. If you cannot see your frontline, you cannot save them.`
          : `- Own the space your team needs for the objective. Over-chasing past the cart/point is how tanks feed.`,
    ]),
    section("Best team ideas", [
      "Flexible Season 9.0-style pairings (adjust for bans and team-ups):",
      "",
      ...compsFor(hero.role, hero.name),
      "",
      `- Full hero page: [${hero.name}](/marvel-rivals/heroes/${hero.slug}) · [Tier list](/marvel-rivals/tier-list)`,
    ]),
    section(`How to counter ${hero.name}`, [
      "Respect these matchups and tools:",
      "",
      ...counters,
      "",
      "- Stack peel before the engage window.",
      "- Do not walk into their strongest cooldown alone.",
      "",
      `- More lessons: [Beginner → Advanced guides](/guides)`,
    ]),
  ].join("\n\n");
}

async function main() {
  const game = await prisma.game.findUniqueOrThrow({ where: { slug: "marvel-rivals" } });
  const heroes = await prisma.hero.findMany({
    where: { gameId: game.id },
    include: { tierEntries: { take: 1, orderBy: { sortOrder: "asc" } } },
    orderBy: { name: "asc" },
  });

  // Remove thin legacy mastery stubs so the index stays clean
  await prisma.guide.deleteMany({
    where: { slug: { endsWith: "-play-mastery" } },
  });

  let sort = 200;
  let upserted = 0;

  for (const hero of heroes) {
    const abilities = Array.isArray(hero.abilities)
      ? (hero.abilities as { name: string; description: string }[])
      : [];
    const slug = `${hero.slug}-how-to-play`;
    const tier = hero.tierEntries[0]?.tier;
    const title = `${hero.name} Guide: How to Play, Abilities & Team Ideas`;
    const excerpt = tier
      ? `How to play ${hero.name} (${ROLE_LABEL[hero.role]}, ${tier}-tier) — kit, fight plan, comps, and counters.`
      : `How to play ${hero.name} (${ROLE_LABEL[hero.role]}) — kit, fight plan, comps, and counters.`;
    const body = buildBody({
      name: hero.name,
      slug: hero.slug,
      role: hero.role,
      difficulty: hero.difficulty,
      summary: hero.summary,
      tips: hero.tips,
      counters: hero.counters,
      abilities,
    });

    await prisma.guide.upsert({
      where: { slug },
      create: {
        gameId: game.id,
        slug,
        title,
        excerpt,
        body,
        level: "intermediate",
        sortOrder: sort++,
      },
      update: {
        title,
        excerpt,
        body,
        level: "intermediate",
        sortOrder: sort - 1,
        gameId: game.id,
      },
    });
    upserted += 1;
    console.log(`OK  ${slug}`);
  }

  const total = await prisma.guide.count();
  const howTo = await prisma.guide.count({ where: { slug: { endsWith: "-how-to-play" } } });
  console.log(`Upserted ${upserted} hero how-to-play guides. how-to=${howTo} total=${total}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
