import { TeamEvent } from "./type";
import { parse, setHours, setMinutes } from "date-fns";
import { getLocation } from "./helpers/sites";
import { getSport } from "./helpers/sports";
import { closeClient, createClient, openClient } from "./helpers/db";

export const write = async (data: TeamEvent[]) => {
  const client = createClient();
  await openClient(client);

  try {
    const createTableQuery = `CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255),
      time TIME,
      name VARCHAR(255),
      location VARCHAR(255),
      teams VARCHAR(255)[],
      isForMedal BOOLEAN,
      date DATE,
      full_date TIMESTAMP,
      code_site VARCHAR(255),
      code_sport VARCHAR(255),
      event_id_for_date VARCHAR(255),
      type_medal VARCHAR(255)
    )`;

    await client.query(createTableQuery);

    for (const row of data) {
      const checkQuery = `SELECT * FROM events WHERE title = $1 AND time = $2 AND name = $3 AND location = $4 AND teams = $5 AND isForMedal = $6 AND date = $7 AND full_date = $8 AND code_site = $9 AND code_sport = $10 AND event_id_for_date = $11 AND type_medal = $12`;

      if (row.time === null) row.time = "00:00";

      const date = parse(row.date, "yyyy-MM-dd", new Date());
      const [hours, minutes] = row.time.split(":").map(Number);
      const dateWithTime = setMinutes(setHours(date, hours), minutes);
      let medalType: string | null = null;

      const newLoc = getLocation(row.location || "");
      const newSport = getSport(row.title || "");

      if (row.isForMedal && row.name) {
        if (row.name.toLowerCase().includes("bronze")) medalType = "Bronze";
        if (row.name.toLowerCase().includes("argent")) medalType = "Silver";
        if (row.name.toLowerCase().includes("or")) medalType = "Gold";
      }

      const checkValues = [
        row.title,
        row.time,
        row.name,
        row.location,
        row.teams,
        row.isForMedal,
        row.date,
        dateWithTime,
        newLoc,
        newSport,
        row.id,
        medalType,
      ];

      const checkResult = await client.query(checkQuery, checkValues);

      if (checkResult.rows.length > 0) {
        console.log("Event already exists, skipping");
        continue;
      }

      const insertQuery = `
            INSERT INTO events (title, time, name, location, teams, isForMedal, date, full_date, code_site, code_sport, event_id_for_date, type_medal)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          `;

      const values = [
        row.title,
        row.time,
        row.name,
        row.location,
        row.teams,
        row.isForMedal,
        row.date,
        dateWithTime,
        newLoc,
        newSport,
        row.id,
        medalType,
      ];

      await client.query(insertQuery, values);
      console.log("Event inserted");
    }
  } catch (error) {
    await closeClient(client);
    console.error(error);
    return false;
  } finally {
    await closeClient(client);
    return true;
  }
};
