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
      event_id_for_date INTEGER,
      sport VARCHAR(255),
      type VARCHAR(255),
      teams VARCHAR(255)[],
      location VARCHAR(255),
      code_site VARCHAR(255),
      code_sport VARCHAR(255),
      for_medal BOOLEAN,
      medal_type VARCHAR(255),
      time TIME,
      date DATE,
      timestamp TIMESTAMP
    )`;

    await client.query(createTableQuery);

    for (const row of data) {
      if (row.time === null) row.time = "00:00";

      const date = parse(row.date, "yyyy-MM-dd", new Date());
      const [hours, minutes] = row.time.split(":").map(Number);
      const dateWithTime = setMinutes(setHours(date, hours), minutes);
      let medalType: string | null = null;

      const code_site = getLocation(row.location || "");
      const code_sport = getSport(row.sport || "");

      if (row.isForMedal && row.type) {
        if (row.type.toLowerCase().includes("bronze")) medalType = "Bronze";
        if (row.type.toLowerCase().includes("argent")) medalType = "Silver";
        if (row.type.toLowerCase().includes("or")) medalType = "Gold";
      }

      const checkQuery = `SELECT * FROM events WHERE type = $1 AND code_site = $2 AND code_sport = $3 AND date = $4 AND time = $5 AND event_id_for_date = $6`;
      const checkValues = [
        row.type,
        code_site,
        code_sport,
        row.date,
        row.time,
        row.id,
      ];

      const checkResult = await client.query(checkQuery, checkValues);

      if (checkResult.rows.length > 0) {
        console.info("Event already exists");
        continue;
      }

      const insertQuery = `
            INSERT INTO events (event_id_for_date, sport, type, teams, location, code_site, code_sport, for_medal, medal_type, time, date, timestamp)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            `;

      const values = [
        row.id,
        row.sport,
        row.type,
        row.teams,
        row.location,
        code_site,
        code_sport,
        row.isForMedal,
        medalType,
        row.time,
        row.date,
        dateWithTime,
      ];

      await client.query(insertQuery, values);
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
