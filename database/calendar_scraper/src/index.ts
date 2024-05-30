import { eachDayOfInterval } from "date-fns";
import cron from "node-cron";
import { scrape } from "./scraper";
import { closeClient, write } from "./db-write";
import { writeToFile } from "./test";

const COMPETITION_START_DATE = new Date("2024-07-24");
const COMPETITION_END_DATE =
  process.env.NODE_ENV === "production"
    ? new Date("2024-08-11")
    : new Date("2024-07-24");
const CRON_SCHEDULE =
  process.env.NODE_ENV === "production" ? "0 4 * * *" : "*/20 * * * *";
const BASE_URL = "https://olympics.com/fr/paris-2024/calendrier/";

const main = async () => {
  if (process.env.NODE_ENV === "production") {
    console.log("Production mode");
  } else {
    console.log("Development mode");
  }

  const allDates = eachDayOfInterval({
    start: COMPETITION_START_DATE,
    end: COMPETITION_END_DATE,
  });

  const data = await scrape(BASE_URL, allDates);

  if (process.env.NODE_ENV !== "production") {
    writeToFile(data, "data.json");
  }

  const isSuccess = await write(data);

  if (isSuccess) {
    console.log("Data written successfully");
  } else {
    console.log("Error writing data");
  }

  closeClient();
  return isSuccess;
};

if (process.env.NODE_ENV !== "production") {
  await main();
  process.exit(0);
} else {
  await main();
  cron.schedule(CRON_SCHEDULE, async () => {
    console.log("Running cron job");
    await main();
    console.log("Cron job finished");
  });
}
