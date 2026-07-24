import "dotenv/config";
import { crawlMarvelRivalsPatches } from "../src/lib/crawlers/patches";

crawlMarvelRivalsPatches()
  .then((result) => {
    console.log(JSON.stringify(result, null, 2));
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
