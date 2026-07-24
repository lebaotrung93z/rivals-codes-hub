import { PrismaClient } from "@prisma/client";
import { createWriteStream } from "fs";
import { mkdir, access } from "fs/promises";
import path from "path";
import { pipeline } from "stream/promises";
import { Readable } from "stream";

const prisma = new PrismaClient();

/** Map our DB slugs → rivalskins.com avatar filename slugs */
const REMOTE_SLUG: Record<string, string> = {
  "adam-warlock": "adam-warlock",
  angela: "angela",
  "black-cat": "black-cat",
  "black-panther": "black-panther",
  "black-widow": "black-widow",
  blade: "blade",
  "captain-america": "captain-america",
  "cloak-dagger": "cloak-and-dagger",
  cyclops: "cyclops",
  daredevil: "daredevil",
  deadpool: "deadpool",
  "devil-dinosaur": "devil-dinosaur",
  "doctor-strange": "doctor-strange",
  "elsa-bloodstone": "elsa-bloodstone",
  "emma-frost": "emma-frost",
  gambit: "gambit",
  groot: "groot",
  hawkeye: "hawkeye",
  hela: "hela",
  hulk: "hulk",
  "human-torch": "human-torch",
  "invisible-woman": "invisible-woman",
  "iron-fist": "iron-fist",
  "iron-man": "iron-man",
  "jeff-the-land-shark": "jeff-the-land-shark",
  jubilee: "jubilee",
  loki: "loki",
  "luna-snow": "luna-snow",
  magik: "magik",
  magneto: "magneto",
  mantis: "mantis",
  "mister-fantastic": "mister-fantastic",
  "moon-knight": "moon-knight",
  namor: "namor",
  "peni-parker": "peni-parker",
  phoenix: "phoenix",
  psylocke: "psylocke",
  "rocket-raccoon": "rocket-raccoon",
  rogue: "rogue",
  "scarlet-witch": "scarlet-witch",
  "spider-man": "spider-man",
  "squirrel-girl": "squirrel-girl",
  "star-lord": "star-lord",
  storm: "storm",
  punisher: "the-punisher",
  "the-thing": "the-thing",
  thor: "thor",
  ultron: "ultron",
  venom: "venom",
  "white-fox": "white-fox",
  "winter-soldier": "winter-soldier",
  wolverine: "wolverine",
};

function remoteUrl(remoteSlug: string) {
  return `https://rivalskins.com/wp-content/uploads/marvel-assets/ui/heroes/avatar/${remoteSlug}_avatar.webp`;
}

async function download(url: string, dest: string) {
  const res = await fetch(url);
  if (!res.ok || !res.body) throw new Error(`HTTP ${res.status} for ${url}`);
  // @ts-expect-error Node fetch body is a web stream
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
}

async function main() {
  const outDir = path.join(process.cwd(), "public", "images", "heroes");
  await mkdir(outDir, { recursive: true });

  const heroes = await prisma.hero.findMany({
    where: { game: { slug: "marvel-rivals" } },
    orderBy: { name: "asc" },
  });

  let ok = 0;
  let fail = 0;

  for (const hero of heroes) {
    const remote = REMOTE_SLUG[hero.slug] ?? hero.slug;
    const filename = `${hero.slug}.webp`;
    const dest = path.join(outDir, filename);
    const localUrl = `/images/heroes/${filename}`;
    const url = remoteUrl(remote);

    try {
      await download(url, dest);
      await access(dest);
      await prisma.hero.update({
        where: { id: hero.id },
        data: {
          imageUrl: localUrl,
          sourceUrl: url,
        },
      });
      console.log(`OK  ${hero.slug} <- ${remote}`);
      ok += 1;
    } catch (error) {
      console.error(
        `FAIL ${hero.slug}:`,
        error instanceof Error ? error.message : error,
      );
      fail += 1;
    }
  }

  console.log(`Done. ok=${ok} fail=${fail}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
