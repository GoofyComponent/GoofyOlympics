import { readFileSync } from "fs";
import pg from "pg";
import neatCsv from "neat-csv";

const { Client } = pg;
const client = new Client({
  user: "postgres",
  password: "postgres",
  host: "localhost",
  port: 5438,
  database: "goofy_olympics",
});

//const csvToParseRAW = readFileSync("../athlete_events.csv", "utf8");
const csvToParseRAW = readFileSync("../noc_regions.csv", "utf8");
const csvToParse = await neatCsv(csvToParseRAW);

console.log(csvToParse);

await client.connect();

const createTableQuery = `CREATE TABLE IF NOT EXISTS noc_regions (
  id SERIAL PRIMARY KEY,
  noc VARCHAR(255),
  region VARCHAR(255),
  notes VARCHAR(255)
)`;

await client.query(createTableQuery);

for (const row of csvToParse) {
  const checkQuery = `SELECT * FROM noc_regions WHERE noc = $1 AND region = $2 AND notes = $3`;

  const checkValues = [row.NOC, row.region, row.notes];

  const checkResult = await client.query(checkQuery, checkValues);

  if (checkResult.rows.length > 0) {
    continue;
  }

  const insertQuery = `
          INSERT INTO noc_regions (noc, region, notes)
          VALUES ($1, $2, $3)
        `;

  const values = [row.NOC, row.region, row.notes];

  await client.query(insertQuery, values);
}

/* const createTableQuery = `CREATE TABLE IF NOT EXISTS athlete_events (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  sex VARCHAR(255),
  age INTEGER,
  height INTEGER,
  weight DECIMAL,
  team VARCHAR(255),
  noc VARCHAR(255),
  games VARCHAR(255),
  year INTEGER,
  season VARCHAR(255),
  city VARCHAR(255),
  sport VARCHAR(255),
  event VARCHAR(255),
  medal VARCHAR(255)
)`;


await client.query(createTableQuery);

for (const row of csvToParse) {
  const checkQuery = `SELECT * FROM athlete_events WHERE name = $1 AND games = $2 AND year = $3 AND city = $4 AND event = $5`;

  const checkValues = [row.Name, row.Games, row.Year, row.City, row.Event];

  const checkResult = await client.query(checkQuery, checkValues);

  if (checkResult.rows.length > 0) {
    continue;
  }

  const insertQuery = `
          INSERT INTO athlete_events (name, sex, age, height, weight, team, noc, games, year, season, city, sport, event, medal)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        `;

  const values = [
    row.Name,
    row.Sex,
    row.Age === "NA" ? null : row.Age,
    row.Height === "NA" ? null : row.Height,
    row.Weight === "NA" ? null : row.Weight,
    row.Team,
    row.NOC,
    row.Games,
    row.Year === "NA" ? null : row.Year,
    row.Season,
    row.City,
    row.Sport,
    row.Event,
    row.Medal,
  ];

  await client.query(insertQuery, values);
} */

await client.end();
