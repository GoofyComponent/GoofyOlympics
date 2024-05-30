import pg from "pg";

import { TeamEvent } from "./type";
import { parse, setHours, setMinutes } from "date-fns";
import { getLocation } from "./helpers/sites";
import { getSport } from "./helpers/sports";

let dbConfig: object;
if (process.env.NODE_ENV === "production") {
  dbConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || "5432"),
  };
} else {
  dbConfig = {
    user: "postgres",
    password: "postgres",
    host: "localhost",
    port: 5438,
    database: "goofy_olympics",
  };
}

const { Client } = pg;
const client = new Client(dbConfig);

await client.connect();

export const write = async (data: TeamEvent[]) => {
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
      event_id_for_date VARCHAR(255)
    )`;

    await client.query(createTableQuery);

    for (const row of data) {
      const checkQuery = `SELECT * FROM events WHERE title = $1 AND time = $2 AND name = $3 AND location = $4 AND teams = $5 AND isForMedal = $6 AND date = $7 AND full_date = $8 AND code_site = $9 AND code_sport = $10 AND event_id_for_date = $11`;

      if (row.time === null) row.time = "00:00";

      const date = parse(row.date, "yyyy-MM-dd", new Date());
      const [hours, minutes] = row.time.split(":").map(Number);
      const dateWithTime = setMinutes(setHours(date, hours), minutes);

      const newLoc = await getLocation(row.location || "");
      const newSport = getSport(row.title || "");

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
      ];

      const checkResult = await client.query(checkQuery, checkValues);

      if (checkResult.rows.length > 0) {
        console.log("Event already exists, skipping");
        continue;
      }

      const insertQuery = `
            INSERT INTO events (title, time, name, location, teams, isForMedal, date, full_date, code_site, code_sport, event_id_for_date)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
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
      ];

      await client.query(insertQuery, values);
      console.log("Event inserted");
    }
  } catch (error) {
    console.error(error);
    return false;
  } finally {
    return true;
  }
};

export const closeClient = async () => {
  await client.end();

  console.log("Connection closed");
};
