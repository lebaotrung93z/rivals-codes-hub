/**
 * Upserts Season 9.0 competitive meta into the DB.
 * Rankings adapted from public community pages (marvelrivals.gg).
 * All hero summaries/tips/notes are original editorial copy.
 */
import "dotenv/config";
import { PrismaClient, HeroRole, TierRank } from "@prisma/client";
import meta from "../src/data/season-9-meta.json";

const prisma = new PrismaClient();

type HeroDef = {
  slug: string;
  name: string;
  role: HeroRole;
  difficulty: number;
  summary: string;
  abilities: { name: string; description: string }[];
  counters: string[];
  tips: string[];
  tierNote: string;
};

const HEROES: HeroDef[] = [
  // —— Vanguard ——
  {
    slug: "hulk",
    name: "Hulk",
    role: "vanguard",
    difficulty: 2,
    summary:
      "A smash-first tank who converts rage into frontline pressure and forces enemies to respect space around the objective.",
    abilities: [
      { name: "Gamma Slam", description: "Close-range burst that contests chokes." },
      { name: "Leap", description: "Engage or reset from vertical angles." },
      { name: "World Breaker", description: "Ultimate that collapses clustered defenses." },
    ],
    counters: ["Punisher", "Hela", "Wolverine"],
    tips: ["Leap after cooldowns are spent, not into a full peel stack.", "Hold ultimate for stacked supports."],
    tierNote: "Season 9.0 S-tier tank when your duelists can follow the dive.",
  },
  {
    slug: "venom",
    name: "Venom",
    role: "vanguard",
    difficulty: 2,
    summary:
      "A dive vanguard who isolates backlines, creates chaos, and opens windows for aggressive duelists.",
    abilities: [
      { name: "Tendril Swing", description: "Engage or escape vertical lanes." },
      { name: "Devour", description: "Sustain while pinning a priority target." },
      { name: "Feast of Symbiotes", description: "Ultimate lockdown on clustered groups." },
    ],
    counters: ["Punisher", "Wolverine", "Hela"],
    tips: ["Swing out if peel tools are still up.", "Call the dive so supports can follow."],
    tierNote: "Top-end dive tank in volatile Season 9.0 comps.",
  },
  {
    slug: "thor",
    name: "Thor",
    role: "vanguard",
    difficulty: 2,
    summary:
      "A brawler tank who thrives in mid-range brawls and punishes teams that overstay on the point.",
    abilities: [
      { name: "Mjolnir Throw", description: "Chip and zone contested space." },
      { name: "Awakening Rune", description: "Power spike for extended fights." },
      { name: "God of Thunder", description: "Ultimate that forces repositioning." },
    ],
    counters: ["Punisher", "Hela", "Magneto"],
    tips: ["Save awaken for the second engage.", "Play near cover so supports can reach you."],
    tierNote: "Reliable S-tier frontline for coordinated brawl comps.",
  },
  {
    slug: "groot",
    name: "Groot",
    role: "vanguard",
    difficulty: 2,
    summary:
      "A wall-builder who reshapes chokes and protects supports during objective holds.",
    abilities: [
      { name: "Vine Wall", description: "Cut sightlines and stall pushes." },
      { name: "Thornlash", description: "Punish enemies who walk into your walls." },
      { name: "Strangling Prison", description: "Ultimate crowd-control for teamfights." },
    ],
    counters: ["Punisher", "Hela", "Iron Man"],
    tips: ["Split the enemy tank from their healers with walls.", "Don't wall yourself out of healing."],
    tierNote: "Strong A-tier on maps with clear choke points.",
  },
  {
    slug: "peni-parker",
    name: "Peni Parker",
    role: "vanguard",
    difficulty: 3,
    summary:
      "A nest-and-deny tank who turns flanks into death traps and rewards patient objective play.",
    abilities: [
      { name: "Cyber-Web", description: "Zone flanks and slow dives." },
      { name: "Spider Mines", description: "Punish enemies who ignore your setup." },
      { name: "Spider-Sweeper", description: "Ultimate clear for contested space." },
    ],
    counters: ["Hela", "Punisher", "Storm"],
    tips: ["Pre-plant webs before the fight, not mid-panic.", "Rotate nests when the enemy soft-resets."],
    tierNote: "A-tier hold specialist when the enemy lacks long-range poke.",
  },
  {
    slug: "the-thing",
    name: "The Thing",
    role: "vanguard",
    difficulty: 2,
    summary:
      "A rugged brawl tank who absorbs pressure and creates safe lanes for short-range duelists.",
    abilities: [
      { name: "Yancy Street Charge", description: "Close the gap and force peels." },
      { name: "Rocky Guard", description: "Soak burst during objective contests." },
      { name: "Clobberin' Time", description: "Ultimate that wins messy close fights." },
    ],
    counters: ["Hela", "Punisher", "Magneto"],
    tips: ["Charge after poke wins the first trade.", "Stay in support LOS—your job is space, not solo kills."],
    tierNote: "A-tier when comps want a durable mid-fight anchor.",
  },
  {
    slug: "devil-dinosaur",
    name: "Devil Dinosaur",
    role: "vanguard",
    difficulty: 2,
    summary:
      "A heavy presence tank who bullies midrange and rewards teams that play around his tempo.",
    abilities: [
      { name: "Stomp", description: "Contest space and interrupt setups." },
      { name: "Roar", description: "Disrupt clustered enemies." },
      { name: "Rampage", description: "Ultimate that forces hard peels." },
    ],
    counters: ["Hela", "Punisher", "Iron Man"],
    tips: ["Don't overchase after the first stomp.", "Use roar to break support ultimates."],
    tierNote: "A-tier space controller in Season 9.0 brawl metas.",
  },
  {
    slug: "doctor-strange",
    name: "Doctor Strange",
    role: "vanguard",
    difficulty: 3,
    summary:
      "A portal tank who creates aggressive flanks and emergency exits for coordinated squads.",
    abilities: [
      { name: "Portal", description: "Open unexpected angles or reset a collapsing fight." },
      { name: "Shield of the Seraphim", description: "Absorb burst while allies reposition." },
      { name: "Eye of Agamotto", description: "Ultimate that turns a won fight into a wipe." },
    ],
    counters: ["Wolverine", "Punisher", "Hela"],
    tips: ["Call portal destinations before casting.", "Defensive portals win as many fights as aggressive ones."],
    tierNote: "B-tier baseline; spikes hard with voice comms.",
  },
  {
    slug: "magneto",
    name: "Magneto",
    role: "vanguard",
    difficulty: 3,
    summary:
      "A control tank who denies projectiles and enables poke comps with well-timed barriers.",
    abilities: [
      { name: "Magnetic Barrier", description: "Block key damage windows for your backline." },
      { name: "Metal Storm", description: "Zone contested objectives." },
      { name: "Meteor M", description: "Ultimate that forces enemies off high ground." },
    ],
    counters: ["Spider-Man", "Black Panther", "Iron Fist"],
    tips: ["Hold barrier for ultimates, not random poke.", "Re-peek from cover after denying a dive."],
    tierNote: "B-tier in Season 9.0 after meta shifts toward dive and regen.",
  },
  {
    slug: "emma-frost",
    name: "Emma Frost",
    role: "vanguard",
    difficulty: 3,
    summary:
      "A diamond-form tank who mixes psychic disruption with durable frontline presence.",
    abilities: [
      { name: "Diamond Form", description: "Soak pressure during objective contests." },
      { name: "Psychic Bind", description: "Interrupt priority targets." },
      { name: "White Queen", description: "Ultimate crowd-control for clustered teams." },
    ],
    counters: ["Punisher", "Hela", "Wolverine"],
    tips: ["Save diamond form for the enemy's burst window.", "Bind dive heroes before they reach supports."],
    tierNote: "B-tier flex tank depending on team-up value.",
  },
  {
    slug: "angela",
    name: "Angela",
    role: "vanguard",
    difficulty: 3,
    summary:
      "An angelic frontliner who contests midrange and rewards precise cooldown timing.",
    abilities: [
      { name: "Heavenly Charge", description: "Close gaps and punish overextensions." },
      { name: "Aegis", description: "Protect allies through burst windows." },
      { name: "Judgment", description: "Ultimate that breaks stalled fights." },
    ],
    counters: ["Hela", "Punisher", "Magneto"],
    tips: ["Don't charge without support follow-up.", "Aegis wins more games than greedy damage."],
    tierNote: "B-tier—solid but less flexible than top tanks this season.",
  },
  {
    slug: "captain-america",
    name: "Captain America",
    role: "vanguard",
    difficulty: 2,
    summary:
      "A shield-focused tank who peels and enables safer advances, but struggles when poke dominates.",
    abilities: [
      { name: "Shield Throw", description: "Chip and interrupt at mid range." },
      { name: "Liberty Charge", description: "Lead the push onto objectives." },
      { name: "Freedom Punch", description: "Ultimate engage that needs team follow-through." },
    ],
    counters: ["Hela", "Punisher", "Storm"],
    tips: ["Peel first, push second.", "Don't ultimate into unanswered poke."],
    tierNote: "C-tier in Season 9.0 competitive—playable, not preferred.",
  },
  {
    slug: "rogue",
    name: "Rogue",
    role: "vanguard",
    difficulty: 3,
    summary:
      "A power-absorbing tank who thrives on messy skirmishes but needs strong setup to stay relevant.",
    abilities: [
      { name: "Absorb", description: "Steal tempo from a key enemy tool." },
      { name: "Southern Comfort", description: "Sustain through extended brawls." },
      { name: "Full Drain", description: "Ultimate that flips a duel if timed well." },
    ],
    counters: ["Hela", "Punisher", "Magik"],
    tips: ["Absorb peel tools, not random damage.", "Stay near your strategists—solo absorbs lose fights."],
    tierNote: "C-tier until team-ups or patches raise her floor.",
  },

  // —— Duelist ——
  {
    slug: "punisher",
    name: "The Punisher",
    role: "duelist",
    difficulty: 2,
    summary:
      "A high-pressure DPS who deletes space with sustained fire and punishes teams that stand still.",
    abilities: [
      { name: "Deliverance", description: "Primary fire pressure from safe angles." },
      { name: "Vengeance Turret", description: "Zone objectives and deny flanks." },
      { name: "Final Judgment", description: "Ultimate that melts clustered targets." },
    ],
    counters: ["Spider-Man", "Black Panther", "Magik"],
    tips: ["Take high ground before the fight starts.", "Turret covers your blind side—don't plant it in the open."],
    tierNote: "Season 9.0 S-tier duelist for competitive ranks.",
  },
  {
    slug: "hela",
    name: "Hela",
    role: "duelist",
    difficulty: 3,
    summary:
      "A precision poke duelist who wins through headshot windows and disciplined positioning.",
    abilities: [
      { name: "Nightsword Thorn", description: "Long-range pressure and picks." },
      { name: "Astral Flock", description: "Reposition after winning a trade." },
      { name: "Goddess of Death", description: "Ultimate that deletes soft targets." },
    ],
    counters: ["Spider-Man", "Black Panther", "Venom"],
    tips: ["Don't greed shots after dive cooldowns come up.", "Flock is for survival first, aggression second."],
    tierNote: "S-tier poke carry when your tanks hold space.",
  },
  {
    slug: "black-panther",
    name: "Black Panther",
    role: "duelist",
    difficulty: 4,
    summary:
      "A high-skill dive assassin who deletes isolated supports and escapes before peels land.",
    abilities: [
      { name: "Spear Toss", description: "Mark and soften priority targets." },
      { name: "Spirit Rend", description: "Close and finish marked enemies." },
      { name: "King of Wakanda", description: "Ultimate that snowballs a won dive." },
    ],
    counters: ["Punisher", "Hela", "Namor"],
    tips: ["Dive after enemy peels are spent.", "Exit immediately if the kill isn't free."],
    tierNote: "S-tier for players who can execute clean dive cycles.",
  },
  {
    slug: "daredevil",
    name: "Daredevil",
    role: "duelist",
    difficulty: 4,
    summary:
      "A melee skirmisher who reads movement, blinds fights, and thrives in chaotic close quarters.",
    abilities: [
      { name: "Radar Sense", description: "Track nearby enemies through clutter." },
      { name: "Sonic Pursuit", description: "Dash onto a marked target and generate fury." },
      { name: "Let The Devil Out", description: "Ultimate that blinds and pressures line-of-sight enemies." },
    ],
    counters: ["Punisher", "Hela", "Storm"],
    tips: ["Build fury before committing the ultimate.", "Objection! wins duels—don't waste it on chip."],
    tierNote: "S-tier close-range threat in Season 9.0 competitive.",
  },
  {
    slug: "magik",
    name: "Magik",
    role: "duelist",
    difficulty: 4,
    summary:
      "A portal duelist who cuts angles, deletes priority targets, and resets before peels arrive.",
    abilities: [
      { name: "Soulsword", description: "Melee pressure in close fights." },
      { name: "Stepping Disc", description: "In-and-out engages through portals." },
      { name: "Darkchild", description: "Ultimate power spike for wipes." },
    ],
    counters: ["Punisher", "Namor", "Hela"],
    tips: ["Portal out on the same path you entered.", "Don't ultimate into unanswered CC."],
    tierNote: "A-tier dive carry with a high skill ceiling.",
  },
  {
    slug: "spider-man",
    name: "Spider-Man",
    role: "duelist",
    difficulty: 4,
    summary:
      "A mobility assassin who swings onto backlines, forces peels, and exits before the trade flips.",
    abilities: [
      { name: "Web Swing", description: "Vertical mobility for engages and escapes." },
      { name: "Get Over Here", description: "Yank priority targets out of position." },
      { name: "Spectacular Spin", description: "Ultimate crowd control in clustered fights." },
    ],
    counters: ["Namor", "Punisher", "Hela"],
    tips: ["Swing out before the second peel lands.", "Yank supports away from their tanks."],
    tierNote: "A-tier after Season 9.0 mobility and team-up shifts.",
  },
  {
    slug: "winter-soldier",
    name: "Winter Soldier",
    role: "duelist",
    difficulty: 3,
    summary:
      "A midrange bruiser who combines hook setups with burst finishes on overextended targets.",
    abilities: [
      { name: "Roterstern", description: "Reliable midrange pressure." },
      { name: "Bionic Hook", description: "Pull priority targets into your team." },
      { name: "Kraken Impact", description: "Ultimate that deletes a locked target." },
    ],
    counters: ["Hela", "Punisher", "Magik"],
    tips: ["Hook into your team, not into theirs.", "Save ultimate for confirmed hooks."],
    tierNote: "A-tier—rising with Season 9.0 balance and team-ups.",
  },
  {
    slug: "star-lord",
    name: "Star-Lord",
    role: "duelist",
    difficulty: 2,
    summary:
      "A mobile gunfighter who kites, contests midrange, and rewards aggressive but disciplined peeks.",
    abilities: [
      { name: "Element Guns", description: "Sustained midrange damage." },
      { name: "Rocket Propulsion", description: "Reposition after winning a trade." },
      { name: "Galactic Legend", description: "Ultimate that melts soft targets in open space." },
    ],
    counters: ["Hela", "Punisher", "Black Panther"],
    tips: ["Propulsion is your life—don't waste it for greed.", "Ultimate after peels are spent."],
    tierNote: "Stable A-tier pick for flexible comps.",
  },
  {
    slug: "namor",
    name: "Namor",
    role: "duelist",
    difficulty: 2,
    summary:
      "A summoner DPS who punishes dive with turrets and controls space around the objective.",
    abilities: [
      { name: "Trident of Neptune", description: "Primary pressure and poke." },
      { name: "Blessing of the Deep", description: "Place summons that deny flanks." },
      { name: "Horn of Proteus", description: "Ultimate that swings contested fights." },
    ],
    counters: ["Hela", "Punisher", "Storm"],
    tips: ["Plant summons before the dive, not after.", "Play near your nests—don't freestyle mid-map."],
    tierNote: "A-tier anti-dive answer rising in Season 9.0.",
  },
  {
    slug: "phoenix",
    name: "Phoenix",
    role: "duelist",
    difficulty: 3,
    summary:
      "A fiery burst DPS who thrives on teamfight windows and punishable clustered enemies.",
    abilities: [
      { name: "Cosmic Fire", description: "Midrange burst into soft targets." },
      { name: "Telekinesis", description: "Reposition or disrupt priority threats." },
      { name: "Dark Phoenix", description: "Ultimate that wins stacked fights." },
    ],
    counters: ["Punisher", "Hela", "Magik"],
    tips: ["Ultimate when enemies are stacked, not spread.", "Don't chase after your burst is spent."],
    tierNote: "A-tier with a slight dip after Season 9.0 adjustments.",
  },
  {
    slug: "elsa-bloodstone",
    name: "Elsa Bloodstone",
    role: "duelist",
    difficulty: 3,
    summary:
      "A hunter duelist who tracks priority targets and converts midfight pressure into picks.",
    abilities: [
      { name: "Monster Hunter", description: "Mark and pressure high-value targets." },
      { name: "Bloodstone Arsenal", description: "Flexible tools for midrange fights." },
      { name: "Hunt Complete", description: "Ultimate finish on a weakened target." },
    ],
    counters: ["Hela", "Punisher", "Namor"],
    tips: ["Mark supports, not the tank, when possible.", "Reset after the first pick—don't overstay."],
    tierNote: "A-tier riser in Season 9.0 competitive.",
  },
  {
    slug: "human-torch",
    name: "Human Torch",
    role: "duelist",
    difficulty: 3,
    summary:
      "An aerial zone DPS who controls lanes with fire and punishes teams that cluster under him.",
    abilities: [
      { name: "Flame On", description: "Sustain aerial pressure." },
      { name: "Fireball", description: "Burst into grouped enemies." },
      { name: "Supernova", description: "Ultimate clear on contested points." },
    ],
    counters: ["Hela", "Hawkeye", "Punisher"],
    tips: ["Don't hover in open sky against hitscan.", "Ultimate onto stacked objectives."],
    tierNote: "B-tier—map and matchup dependent.",
  },
  {
    slug: "moon-knight",
    name: "Moon Knight",
    role: "duelist",
    difficulty: 3,
    summary:
      "A ricochet specialist who thrives when enemies stack and struggles against spread formations.",
    abilities: [
      { name: "Crescent Darts", description: "Bounce damage through clustered foes." },
      { name: "Moonlight Hook", description: "Reposition or yank a target." },
      { name: "Hand of Khonshu", description: "Ultimate pressure on the point." },
    ],
    counters: ["Hela", "Punisher", "Spider-Man"],
    tips: ["Force enemies into your bounce angles.", "Don't play wide-open maps without cover."],
    tierNote: "B-tier after Season 9.0 poke and regen shifts.",
  },
  {
    slug: "black-widow",
    name: "Black Widow",
    role: "duelist",
    difficulty: 4,
    summary:
      "A precision sniper who rewards perfect aim and loses value when dive never stops.",
    abilities: [
      { name: "Red Room Rifle", description: "Long-range picks." },
      { name: "Edge Dancer", description: "Escape dive and re-angle." },
      { name: "Fleet Charge", description: "Ultimate that deletes soft targets." },
    ],
    counters: ["Spider-Man", "Black Panther", "Magik"],
    tips: ["Take off-angles, not the main sightline.", "Edge Dancer is for survival—don't greed."],
    tierNote: "B-tier rising—still aim-gated.",
  },
  {
    slug: "iron-man",
    name: "Iron Man",
    role: "duelist",
    difficulty: 2,
    summary:
      "A flying artillery DPS who melts tanks and objectives when left unanswered in the sky.",
    abilities: [
      { name: "Repulsor Blast", description: "Midrange pressure from the air." },
      { name: "Armor Overdrive", description: "Burst window for deletes." },
      { name: "Invincible Pulse Cannon", description: "Ultimate that wins stalled fights." },
    ],
    counters: ["Hela", "Hawkeye", "Punisher"],
    tips: ["Don't fly straight lines against hitscan.", "Overdrive after peels are spent."],
    tierNote: "B-tier—slightly down in Season 9.0.",
  },
  {
    slug: "mister-fantastic",
    name: "Mister Fantastic",
    role: "duelist",
    difficulty: 3,
    summary:
      "A stretchy skirmisher who contests midrange and creates awkward angles for rigid comps.",
    abilities: [
      { name: "Stretch Strike", description: "Poke and displace from odd ranges." },
      { name: "Elastic Defense", description: "Survive burst while re-angling." },
      { name: "Brainiac Bounce", description: "Ultimate that disrupts clustered defenses." },
    ],
    counters: ["Hela", "Punisher", "Magik"],
    tips: ["Abuse max range—don't stand in melee.", "Ultimate to break setups, not for raw damage."],
    tierNote: "B-tier flex duelist.",
  },
  {
    slug: "blade",
    name: "Blade",
    role: "duelist",
    difficulty: 3,
    summary:
      "A hunter duelist who converts sustain trades into kills and thrives in prolonged skirmishes.",
    abilities: [
      { name: "Daywalker Edge", description: "Melee/midrange pressure." },
      { name: "Blood Hunt", description: "Track and finish wounded targets." },
      { name: "Vampire Hunter", description: "Ultimate that snowballs a won duel." },
    ],
    counters: ["Hela", "Punisher", "Namor"],
    tips: ["Trade when your sustain is up.", "Don't dive full-health backlines alone."],
    tierNote: "B-tier riser in Season 9.0.",
  },
  {
    slug: "wolverine",
    name: "Wolverine",
    role: "duelist",
    difficulty: 3,
    summary:
      "A regenerative brawler who wins extended duels and struggles into disciplined poke.",
    abilities: [
      { name: "Savage Claw", description: "Close-range shred." },
      { name: "Feral Leap", description: "Engage or chase a kill." },
      { name: "Best There Is", description: "Ultimate that refuses to die in a brawl." },
    ],
    counters: ["Hela", "Punisher", "Magneto"],
    tips: ["Leap after poke is spent.", "Ultimate into brawls, not open sightlines."],
    tierNote: "B-tier—slightly down this season.",
  },
  {
    slug: "deadpool",
    name: "Deadpool",
    role: "duelist",
    difficulty: 3,
    summary:
      "A chaotic skirmisher who regenerates through messy fights and rewards opportunistic play.",
    abilities: [
      { name: "Bang Bang", description: "Midrange chip and pressure." },
      { name: "Teleport", description: "Reposition after a bad trade." },
      { name: "Chimichanga Barrage", description: "Ultimate that floods a contested area." },
    ],
    counters: ["Hela", "Punisher", "Namor"],
    tips: ["Reset often—your value is uptime, not hero plays.", "Teleport out before peels stack."],
    tierNote: "B-tier chaotic flex for solo queue.",
  },
  {
    slug: "black-cat",
    name: "Black Cat",
    role: "duelist",
    difficulty: 3,
    summary:
      "A slippery disruptor who steals tempo, forces awkward peels, and escapes before the trade flips.",
    abilities: [
      { name: "Cat's Claw", description: "Quick close-range pressure." },
      { name: "Bad Luck", description: "Disrupt priority targets." },
      { name: "Nine Lives", description: "Ultimate that creates a chaotic window." },
    ],
    counters: ["Punisher", "Hela", "Namor"],
    tips: ["Hit and run—don't freestyle mid-teamfight.", "Force peels, then leave."],
    tierNote: "B-tier disruptor when dive is open.",
  },
  {
    slug: "cyclops",
    name: "Cyclops",
    role: "duelist",
    difficulty: 2,
    summary:
      "A beam specialist who holds lanes and punishes teams that walk straight into his sightline.",
    abilities: [
      { name: "Optic Blast", description: "Lane control and sustained pressure." },
      { name: "Tactical Visor", description: "Burst window for picks." },
      { name: "Phoenix Protocol", description: "Ultimate that clears contested space." },
    ],
    counters: ["Spider-Man", "Black Panther", "Magik"],
    tips: ["Hold angles, don't chase.", "Visor after the enemy commits."],
    tierNote: "B-tier steady midrange option.",
  },
  {
    slug: "storm",
    name: "Storm",
    role: "duelist",
    difficulty: 3,
    summary:
      "A weather controller who enables team tempo but dropped in value after Season 9.0 shifts.",
    abilities: [
      { name: "Wind Blade", description: "Midrange pressure." },
      { name: "Weather Control", description: "Buff allies or slow enemies." },
      { name: "Omega Hurricane", description: "Ultimate that reshapes a fight." },
    ],
    counters: ["Hela", "Punisher", "Hawkeye"],
    tips: ["Play with your team—solo Storm loses.", "Ultimate to enable engages, not for vanity damage."],
    tierNote: "C-tier—down in Season 9.0 competitive.",
  },
  {
    slug: "hawkeye",
    name: "Hawkeye",
    role: "duelist",
    difficulty: 4,
    summary:
      "A bow specialist who can delete from range but is unforgiving when dive never stops.",
    abilities: [
      { name: "Ronin Bow", description: "Precision long-range damage." },
      { name: "Hunter's Arrow", description: "Utility shots for setups." },
      { name: "Piercing Arrow", description: "Ultimate that punishes stacked lines." },
    ],
    counters: ["Spider-Man", "Black Panther", "Magik"],
    tips: ["Take off-angles with an escape plan.", "Don't stand main when dive is up."],
    tierNote: "C-tier—down this season; still scary in the right hands.",
  },
  {
    slug: "squirrel-girl",
    name: "Squirrel Girl",
    role: "duelist",
    difficulty: 2,
    summary:
      "A bounce-and-swarm DPS who shines on cluttered maps and struggles into disciplined poke.",
    abilities: [
      { name: "Burst Acorn", description: "Bounce damage through cover." },
      { name: "Tail Twirl", description: "Survive close pressure." },
      { name: "Unbeatable Squirrel Girl", description: "Ultimate swarm on the point." },
    ],
    counters: ["Hela", "Punisher", "Storm"],
    tips: ["Abuse bounce angles around corners.", "Ultimate onto the objective, not mid-air."],
    tierNote: "C-tier situational pick.",
  },
  {
    slug: "scarlet-witch",
    name: "Scarlet Witch",
    role: "duelist",
    difficulty: 2,
    summary:
      "A chaos mage who melts close targets but needs setup to survive competitive peels.",
    abilities: [
      { name: "Chaos Control", description: "Close-range auto pressure." },
      { name: "Hex Bolts", description: "Burst into soft targets." },
      { name: "Reality Erasure", description: "Ultimate that deletes a locked fight." },
    ],
    counters: ["Hela", "Punisher", "Hawkeye"],
    tips: ["Don't walk main without tanks.", "Ultimate after peels are spent."],
    tierNote: "C-tier—needs the right comp to matter.",
  },
  {
    slug: "psylocke",
    name: "Psylocke",
    role: "duelist",
    difficulty: 4,
    summary:
      "A psychic assassin who can still pop supports but sits lower in the Season 9.0 hierarchy.",
    abilities: [
      { name: "Psionic Crossbow", description: "Poke before the dive." },
      { name: "Psi-Blade Dash", description: "Close and finish." },
      { name: "Dance of the Butterfly", description: "Ultimate wipe potential." },
    ],
    counters: ["Namor", "Punisher", "Hela"],
    tips: ["Dash out if the kill isn't free.", "Crossbow first, blade second."],
    tierNote: "C-tier but rising—watch for further buffs.",
  },
  {
    slug: "iron-fist",
    name: "Iron Fist",
    role: "duelist",
    difficulty: 3,
    summary:
      "A chi brawler who wins clean duels but dropped hard against the current poke and peel meta.",
    abilities: [
      { name: "Jeet Kune Do", description: "Close-range combo pressure." },
      { name: "K'un-Lun Kick", description: "Engage or finish." },
      { name: "Living Weapon", description: "Ultimate that refuses to lose a brawl." },
    ],
    counters: ["Punisher", "Hela", "Namor"],
    tips: ["Only dive after peels are gone.", "Don't ultimate into full health backlines."],
    tierNote: "C-tier—down in Season 9.0 competitive.",
  },

  // —— Strategist ——
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
      { name: "C.Y.A.", description: "Ultimate revive that resets a lost fight." },
    ],
    counters: ["Hela", "Punisher", "Storm"],
    tips: ["Hide revive beacons before the fight.", "Don't greed damage when tanks are dry."],
    tierNote: "S-tier stabilizer for competitive queues.",
  },
  {
    slug: "cloak-dagger",
    name: "Cloak & Dagger",
    role: "strategist",
    difficulty: 3,
    summary:
      "A dual-form support who swaps between healing lanes and disruptive darkness to control tempo.",
    abilities: [
      { name: "Light Force Dagger", description: "Heal and enable allies." },
      { name: "Darkforce", description: "Disrupt and peel threats." },
      { name: "Eternal Bond", description: "Ultimate that swings stalled fights." },
    ],
    counters: ["Hela", "Punisher", "Black Panther"],
    tips: ["Swap forms before you panic, not after.", "Ultimate with your tank's engage."],
    tierNote: "S-tier flexible support pair.",
  },
  {
    slug: "invisible-woman",
    name: "Invisible Woman",
    role: "strategist",
    difficulty: 3,
    summary:
      "A shield-and-force strategist who peels dives and enables aggressive takes with well-timed fields.",
    abilities: [
      { name: "Force Control", description: "Shield allies and displace threats." },
      { name: "Invisible Veil", description: "Reposition safely." },
      { name: "Invisible Boundary", description: "Ultimate that locks a won fight." },
    ],
    counters: ["Hela", "Punisher", "Wolverine"],
    tips: ["Save peels for dive ultimates.", "Don't waste veil for vanity flanks."],
    tierNote: "S-tier peel support in Season 9.0.",
  },
  {
    slug: "gambit",
    name: "Gambit",
    role: "strategist",
    difficulty: 3,
    summary:
      "A card-slinging support who mixes utility, tempo boosts, and explosive midfight value.",
    abilities: [
      { name: "Kinetic Cards", description: "Heal or pressure depending on charge." },
      { name: "Staff Sweep", description: "Peel close threats." },
      { name: "Ace in the Hole", description: "Ultimate that flips contested fights." },
    ],
    counters: ["Hela", "Punisher", "Black Panther"],
    tips: ["Charge cards before the engage.", "Peel first—damage second."],
    tierNote: "S-tier Season 9.0 strategist with strong team-up value.",
  },
  {
    slug: "mantis",
    name: "Mantis",
    role: "strategist",
    difficulty: 2,
    summary:
      "A buff-focused healer who amplifies carries and sleeps priority threats at the right moment.",
    abilities: [
      { name: "Life Energy", description: "Heal over time on allies." },
      { name: "Spore Spit", description: "Sleep a diving threat." },
      { name: "Soul's Fire", description: "Ultimate that wins extended fights." },
    ],
    counters: ["Hela", "Punisher", "Spider-Man"],
    tips: ["Sleep the dive, not the tank.", "Buff your best duelist before the engage."],
    tierNote: "A-tier enabler for carry-heavy comps.",
  },
  {
    slug: "luna-snow",
    name: "Luna Snow",
    role: "strategist",
    difficulty: 2,
    summary:
      "A tempo support who freezes dives, heals lanes, and ults to stabilize collapsing fights.",
    abilities: [
      { name: "Light & Dark Ice", description: "Heal allies or slow enemies." },
      { name: "Share the Stage", description: "Link value between teammates." },
      { name: "Fate of Both Worlds", description: "Ultimate that resets a lost fight." },
    ],
    counters: ["Hela", "Punisher", "Black Panther"],
    tips: ["Ultimate early enough to save the fight.", "Freeze dive heroes, not the frontline."],
    tierNote: "A-tier cornerstone support.",
  },
  {
    slug: "jeff-the-land-shark",
    name: "Jeff The Land Shark",
    role: "strategist",
    difficulty: 2,
    summary:
      "A mobile heal shark who spit-heals from odd angles and ults to gulp priority threats.",
    abilities: [
      { name: "Joyful Splash", description: "Heal allies from flexible positions." },
      { name: "Hide and Seek", description: "Dive underground to escape." },
      { name: "It's Jeff!", description: "Ultimate that removes enemies from the fight." },
    ],
    counters: ["Hela", "Punisher", "Storm"],
    tips: ["Heal from off-angles.", "Ultimate the backline, not the full-health tank."],
    tierNote: "A-tier chaotic but effective support.",
  },
  {
    slug: "jubilee",
    name: "Jubilee",
    role: "strategist",
    difficulty: 3,
    summary:
      "Season 9.0's new fireworks support who blends area utility with teamfight tempo swings.",
    abilities: [
      { name: "Firework Burst", description: "Heal and disrupt in a radius." },
      { name: "Plasma Confetti", description: "Zone flanks and peel dives." },
      { name: "Light Show", description: "Ultimate that swings contested objectives." },
    ],
    counters: ["Hela", "Punisher", "Black Panther"],
    tips: ["Pre-place utility before the dive.", "Ultimate with your tank's engage timer."],
    tierNote: "A-tier new hero—meta still settling.",
  },
  {
    slug: "loki",
    name: "Loki",
    role: "strategist",
    difficulty: 4,
    summary:
      "A clone-and-trick support who creates confusion and value when the team can play around illusions.",
    abilities: [
      { name: "Illusion", description: "Misdirect dive and soak attention." },
      { name: "Deception", description: "Reposition or swap under pressure." },
      { name: "God of Mischief", description: "Ultimate that multiplies fight value." },
    ],
    counters: ["Hela", "Punisher", "Wolverine"],
    tips: ["Illusions are peels—use them early.", "Don't ultimate without a plan for the real body."],
    tierNote: "B-tier high-skill support.",
  },
  {
    slug: "adam-warlock",
    name: "Adam Warlock",
    role: "strategist",
    difficulty: 3,
    summary:
      "A revive-focused healer who stabilizes after lost fights and rewards disciplined cooldown use.",
    abilities: [
      { name: "Quantum Magic", description: "Reliable midrange healing." },
      { name: "Soul Bond", description: "Share damage across linked allies." },
      { name: "Karmic Revival", description: "Ultimate mass revive window." },
    ],
    counters: ["Hela", "Punisher", "Black Panther"],
    tips: ["Ultimate after the wipe threat, not before.", "Soul Bond the dive target."],
    tierNote: "B-tier—still strong into dive-heavy lobbies.",
  },
  {
    slug: "white-fox",
    name: "White Fox",
    role: "strategist",
    difficulty: 3,
    summary:
      "A fox-spirit support who mixes mobility, peel, and opportunistic healing in skirmish comps.",
    abilities: [
      { name: "Spirit Dash", description: "Reposition under dive." },
      { name: "Moonlit Heal", description: "Burst heal allies in range." },
      { name: "Nine-Tail Ward", description: "Ultimate peel for collapsing fights." },
    ],
    counters: ["Hela", "Punisher", "Storm"],
    tips: ["Dash after the dive commits.", "Ward the support line, not the frontline vanity angle."],
    tierNote: "B-tier flex support in Season 9.0.",
  },
  {
    slug: "ultron",
    name: "Ultron",
    role: "strategist",
    difficulty: 3,
    summary:
      "A machine support whose drones and protocols struggle to keep pace with the current regen meta.",
    abilities: [
      { name: "Encephalo-Ray", description: "Heal or pressure depending on mode." },
      { name: "Drone Network", description: "Automate support coverage." },
      { name: "Rage of Ultron", description: "Ultimate that floods a fight with machines." },
    ],
    counters: ["Hela", "Punisher", "Magneto"],
    tips: ["Pre-place drones before the engage.", "Don't greed damage when tanks are dry."],
    tierNote: "C-tier until further balance or team-up help.",
  },
];

function slugifyName(name: string): string {
  const aliases = meta.nameAliases as Record<string, string>;
  if (aliases[name]) return aliases[name];
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function main() {
  const game = await prisma.game.findUnique({ where: { slug: "marvel-rivals" } });
  if (!game) throw new Error("marvel-rivals game missing—run db:seed first");

  console.log("Upserting heroes…");
  const bySlug = new Map<string, { id: string; slug: string }>();

  for (const hero of HEROES) {
    const row = await prisma.hero.upsert({
      where: { gameId_slug: { gameId: game.id, slug: hero.slug } },
      create: {
        gameId: game.id,
        slug: hero.slug,
        name: hero.name,
        role: hero.role,
        difficulty: hero.difficulty,
        summary: hero.summary,
        abilities: hero.abilities,
        counters: hero.counters,
        tips: hero.tips,
        sourceUrl: "https://www.marvelrivals.com/",
      },
      update: {
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
    bySlug.set(hero.slug, row);
  }

  // Build combined competitive tier list from role lists
  const noteBySlug = new Map(HEROES.map((h) => [h.slug, h.tierNote]));
  const entries: { heroId: string; tier: TierRank; note: string; sortOrder: number }[] = [];
  let sort = 0;

  for (const role of ["duelist", "strategist", "vanguard"] as const) {
    const tiers = meta.tiersByRole[role] as Record<string, string[]>;
    for (const tier of ["S", "A", "B", "C"] as TierRank[]) {
      for (const name of tiers[tier] ?? []) {
        const slug = slugifyName(name);
        const hero = bySlug.get(slug);
        if (!hero) {
          console.warn(`Missing hero for tier entry: ${name} (${slug})`);
          continue;
        }
        // Prefer first placement if a hero somehow appears twice
        if (entries.some((e) => e.heroId === hero.id)) continue;
        entries.push({
          heroId: hero.id,
          tier,
          note: noteBySlug.get(slug) ?? `${tier}-tier ${role} in Season ${meta.season} competitive.`,
          sortOrder: sort++,
        });
      }
    }
  }

  await prisma.tierEntry.deleteMany({ where: { gameId: game.id } });
  await prisma.tierList.deleteMany({ where: { gameId: game.id } });

  const tierList = await prisma.tierList.create({
    data: {
      gameId: game.id,
      title: `Marvel Rivals Season ${meta.season} Competitive Tier List`,
      mode: meta.mode,
      summary: `Editorial Diamond+ rankings for Season ${meta.season}. Low tiers are not “unplayable”—they need more work or the right stack. Meta is volatile after team-up and regen changes.`,
    },
  });

  for (const entry of entries) {
    await prisma.tierEntry.create({
      data: {
        tierListId: tierList.id,
        gameId: game.id,
        heroId: entry.heroId,
        tier: entry.tier,
        note: entry.note,
        sortOrder: entry.sortOrder,
      },
    });
  }

  console.log(
    `Done: ${bySlug.size} heroes upserted, ${entries.length} tier entries, season ${meta.season}.`,
  );
  console.log(`Sources: ${meta.source.urls.join(", ")}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
