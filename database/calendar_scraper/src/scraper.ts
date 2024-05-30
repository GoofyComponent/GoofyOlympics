import puppeteer from "puppeteer";
import { fr } from "date-fns/locale";
import { format } from "date-fns";
import { CalendarEvent, TeamEvent } from "./type";

const U_A =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36";
const TEAM_VS_TEAM_SPORTS = [
  "Football",
  "Handball",
  "Basketball",
  "Hockey sur Gazon",
  "Water-Polo",
];

export const scrape = async (
  base_url: string,
  allDates: Date[]
): Promise<TeamEvent[]> => {
  const data: TeamEvent[] = [];

  for (const day of allDates) {
    const parsedDate = format(new Date(day), "d-MMMM", { locale: fr }).replace(
      "août",
      "aout"
    );

    const url = `${base_url}${parsedDate}`;

    const browser = await puppeteer.launch({
      headless: process.env.NODE_ENV === "production",
    });
    const page = await browser.newPage();

    page.on("console", (msg) => {
      for (let i = 0; i < msg.args().length; ++i)
        console.log(`${i}: ${msg.args()[i]}`);
    });

    await page.setUserAgent(U_A);
    await page.goto(url);
    await page.setViewport({ width: 1080, height: 1024 });

    const selector = 'div[data-cy="daily-event-list"]';

    const nodes = await page.$$(selector);

    if (nodes.length === 0) {
      console.log("No events found for", parsedDate);
      continue;
    }

    const events: TeamEvent[] = [];
    let index = 1;

    for (const node of nodes) {
      const title = await node.$eval(
        '[class*="DisciplineHeading"]',
        (el) => el.textContent
      );

      const allEvents = await node.$$('[data-cy="videos-hero"]');
      for (const event of allEvents) {
        const item: TeamEvent = {
          id: index,
          title: "",
          time: null,
          name: "",
          location: "",
          teams: [],
          isForMedal: false,
          date: "",
        };
        item.id = index;
        item.title = title || "";

        try {
          const eventTime = await event.$eval(
            '[class*="Time"]',
            (el) => el.textContent
          );
          item.time = eventTime;
        } catch (error) {
          item.time = null;
        }

        try {
          const eventName = await event.$eval(
            '[class*="TitleContainer"]',
            (el) => el.textContent
          );
          item.name = eventName;
        } catch (error) {
          item.name = null;
        }

        if (TEAM_VS_TEAM_SPORTS.includes(title || "")) {
          try {
            const eventLocation = await event.$eval(
              '[class*="VenueContainer"]',
              (el) => el.textContent
            );

            item.location = eventLocation;
          } catch (error) {
            const eventLocation = await node.$eval(
              '[class*="VenueContainer"]',
              (el) => el.textContent
            );

            item.location = eventLocation;
          }

          item.teams = [];
          try {
            const eventLeftTeam = await event.$eval(
              '[class*="LeftCountryContainer"]',
              (el) => el.textContent
            );

            item.teams.push(eventLeftTeam || "");
          } catch (error) {}

          try {
            const eventRightTeam = await event.$eval(
              '[class*="RightCountryContainer"]',
              (el) => el.textContent
            );

            item.teams.push(eventRightTeam || "");
          } catch (error) {}
        } else {
          const eventLocation = await node.$eval(
            '[class*="VenueContainer"]',
            (el) => el.textContent
          );
          item.location = eventLocation;
        }

        try {
          await event.$eval(
            '[class*="MedalContainer"]',
            (el) => el.textContent
          );
          item.isForMedal = true;
        } catch (error) {
          item.isForMedal = false;
        }

        item.date = format(new Date(day), "yyyy-MM-dd", { locale: fr });
        events.push(item);
        index++;
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
    await page.close();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await browser.close();
    data.push(...events);
    console.log("Browser closed");
  }

  await new Promise((resolve) => setTimeout(resolve, 2000));

  return data;
};
