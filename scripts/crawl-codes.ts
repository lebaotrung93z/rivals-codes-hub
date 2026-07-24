import "dotenv/config";
import { runCodesPipeline } from "../src/lib/crawlers/codes";

runCodesPipeline()
  .then((result) => {
    console.log(JSON.stringify(result, null, 2));
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
