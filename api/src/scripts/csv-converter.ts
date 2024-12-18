import { readFileSync } from "fs";
import { PrismaClient } from "@prisma/client";
import neatCsv from "neat-csv";
import path from "path";
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();

// Obtenir le chemin du fichier actuel en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chemin relatif vers les fichiers CSV depuis la racine du projet
const CSV_PATH = path.join(__dirname, "../../data");

async function importNocRegions() {
    console.log("Importing NOC regions...");
    const csvToParseRAW = readFileSync(path.join(CSV_PATH, "noc_regions.csv"), "utf8");
    const csvToParse = await neatCsv(csvToParseRAW);

    for (const row of csvToParse) {
        try {
            const existing = await prisma.noc_regions.findFirst({
                where: {
                    noc: row.NOC,
                    region: row.region
                }
            });

            if (!existing) {
                await prisma.noc_regions.create({
                    data: {
                        noc: row.NOC,
                        region: row.region,
                        notes: row.notes || null
                    }
                });
            }
        } catch (error) {
            console.error(`Error importing NOC region ${row.NOC}:`, error);
        }
    }
    console.log("NOC regions import completed!");
}

async function importAthleteEvents() {
    console.log("Importing athlete events...");
    const csvToParseRAW = readFileSync(path.join(CSV_PATH, "athlete_events.csv"), "utf8");
    const csvToParse = await neatCsv(csvToParseRAW);

    let count = 0;
    const batchSize = 1000;
    const totalRows = csvToParse.length;

    for (const row of csvToParse) {
        try {
            const existing = await prisma.athlete_events.findFirst({
                where: {
                    name: row.Name,
                    games: row.Games,
                    year: row.Year !== "NA" ? parseInt(row.Year) : null,
                    city: row.City,
                    event: row.Event
                }
            });

            if (!existing) {
                await prisma.athlete_events.create({
                    data: {
                        name: row.Name,
                        sex: row.Sex,
                        age: row.Age !== "NA" ? parseInt(row.Age) : null,
                        height: row.Height !== "NA" ? parseFloat(row.Height) : null,
                        weight: row.Weight !== "NA" ? parseFloat(row.Weight) : null,
                        team: row.Team,
                        noc: row.NOC,
                        games: row.Games,
                        year: row.Year !== "NA" ? parseInt(row.Year) : null,
                        season: row.Season,
                        city: row.City,
                        sport: row.Sport,
                        event: row.Event,
                        medal: row.Medal !== "NA" ? row.Medal : null
                    }
                });
            }

            count++;
            if (count % batchSize === 0) {
                console.log(`Processed ${count}/${totalRows} entries (${Math.round(count/totalRows*100)}%)`);
            }
        } catch (error) {
            console.error(`Error importing athlete event for ${row.Name}:`, error);
        }
    }
    console.log("Athlete events import completed!");
}

async function main() {
    try {
        await importNocRegions();
        await importAthleteEvents();
    } catch (error) {
        console.error("Error during import:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
