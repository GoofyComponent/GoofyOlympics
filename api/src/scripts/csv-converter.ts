import {existsSync, readFileSync} from "fs";
import {PrismaClient} from "@prisma/client";
import neatCsv from "neat-csv";
import path from "path";
import {fileURLToPath} from 'url';

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chemin relatif vers les fichiers CSV depuis la racine du projet
const CSV_PATH = path.join(__dirname, "../../data");

// Flags pour suivre les imports déjà effectués
const importFlags = {
    nocRegions: false,
    athleteEvents: false,
    questions: false
};


// Fonction pour vérifier si un import a déjà été effectué
async function checkImportStatus(tableName: string): Promise<boolean> {
    const count = await prisma[tableName].count();
    return count > 0;
}

const QUESTIONS = [
    {
        title: "Ville hôte des JO 2024",
        content: "Quelle ville accueillera les Jeux Olympiques d'été en 2024 ?",
        answers: [
            {content: "Paris", isCorrect: true},
            {content: "Londres", isCorrect: false},
            {content: "New York", isCorrect: false},
            {content: "Tokyo", isCorrect: false}
        ]
    },
    {
        title: "Dates des JO 2024",
        content: "Quelles sont les dates officielles des Jeux Olympiques de Paris 2024 ?",
        answers: [
            {content: "26 juillet au 11 août 2024", isCorrect: true},
            {content: "1er au 15 août 2024", isCorrect: false},
            {content: "15 au 30 juillet 2024", isCorrect: false},
            {content: "1er au 15 septembre 2024", isCorrect: false}
        ]
    },
    {
        title: "Mascotte des JO 2024",
        content: "Quelle est la mascotte officielle des JO de Paris 2024 ?",
        answers: [
            {content: "Les Phryges", isCorrect: true},
            {content: "Les Coqs", isCorrect: false},
            {content: "Les Tours Eiffel", isCorrect: false},
            {content: "Les Baguettes", isCorrect: false}
        ]
    },
    {
        title: "Nouveau sport olympique",
        content: "Quel sport fera son entrée aux JO de Paris 2024 ?",
        answers: [
            {content: "Breaking (Breakdance)", isCorrect: true},
            {content: "Cricket", isCorrect: false},
            {content: "Squash", isCorrect: false},
            {content: "Pétanque", isCorrect: false}
        ]
    },
    {
        title: "Site emblématique",
        content: "Quel monument parisien accueillera des épreuves de beach-volley ?",
        answers: [
            {content: "Le Champ de Mars", isCorrect: true},
            {content: "Les Champs-Élysées", isCorrect: false},
            {content: "Le Jardin des Tuileries", isCorrect: false},
            {content: "Le Jardin du Luxembourg", isCorrect: false}
        ]
    },
    {
        title: "Slogan des JO 2024",
        content: "Quel est le slogan officiel des Jeux Olympiques de Paris 2024 ?",
        answers: [
            {content: "Games Wide Open", isCorrect: true},
            {content: "Made For Sharing", isCorrect: false},
            {content: "Together We Can", isCorrect: false},
            {content: "Light Up Tomorrow", isCorrect: false}
        ]
    },
    {
        title: "Cérémonie d'ouverture",
        content: "Quelle est la particularité de la cérémonie d'ouverture des JO 2024 ?",
        answers: [
            {content: "Elle se déroulera sur la Seine", isCorrect: true},
            {content: "Elle aura lieu à la Tour Eiffel", isCorrect: false},
            {content: "Elle se tiendra au Stade de France", isCorrect: false},
            {content: "Elle sera au Parc des Princes", isCorrect: false}
        ]
    },
    {
        title: "Budget des JO",
        content: "Quel est le budget prévisionnel des JO de Paris 2024 ?",
        answers: [
            {content: "8,8 milliards d'euros", isCorrect: true},
            {content: "5 milliards d'euros", isCorrect: false},
            {content: "12 milliards d'euros", isCorrect: false},
            {content: "15 milliards d'euros", isCorrect: false}
        ]
    },
    {
        title: "Nombre de sports",
        content: "Combien de sports seront représentés aux JO de Paris 2024 ?",
        answers: [
            {content: "32", isCorrect: true},
            {content: "28", isCorrect: false},
            {content: "35", isCorrect: false},
            {content: "30", isCorrect: false}
        ]
    },
    {
        title: "Sites de compétition",
        content: "Combien de sites de compétition sont prévus pour les JO de Paris 2024 ?",
        answers: [
            {content: "35", isCorrect: true},
            {content: "25", isCorrect: false},
            {content: "40", isCorrect: false},
            {content: "30", isCorrect: false}
        ]
    },
    {
        title: "JO d'hiver 2026",
        content: "Quelles villes accueilleront les Jeux Olympiques d'hiver en 2026 ?",
        answers: [
            {content: "Milan-Cortina", isCorrect: true},
            {content: "Salt Lake City", isCorrect: false},
            {content: "Sapporo", isCorrect: false},
            {content: "Vancouver", isCorrect: false}
        ]
    },
    {
        title: "Dates JO 2026",
        content: "Quelles sont les dates des Jeux Olympiques d'hiver de Milan-Cortina 2026 ?",
        answers: [
            {content: "6 au 22 février 2026", isCorrect: true},
            {content: "1er au 15 février 2026", isCorrect: false},
            {content: "15 février au 2 mars 2026", isCorrect: false},
            {content: "20 janvier au 5 février 2026", isCorrect: false}
        ]
    },
    {
        title: "Sites JO 2026",
        content: "Quelle est la particularité géographique des JO de Milan-Cortina 2026 ?",
        answers: [
            {content: "Les sites sont répartis sur 4 clusters distincts", isCorrect: true},
            {content: "Tous les sites sont en ville", isCorrect: false},
            {content: "Les sites sont tous en montagne", isCorrect: false},
            {content: "Les sites sont tous dans la même région", isCorrect: false}
        ]
    },
    {
        title: "JO d'été 2028",
        content: "Quelle ville accueillera les Jeux Olympiques d'été en 2028 ?",
        answers: [
            {content: "Los Angeles", isCorrect: true},
            {content: "Brisbane", isCorrect: false},
            {content: "Toronto", isCorrect: false},
            {content: "Doha", isCorrect: false}
        ]
    },
    {
        title: "Dates JO 2028",
        content: "Quelles sont les dates prévues pour les JO de Los Angeles 2028 ?",
        answers: [
            {content: "14 au 30 juillet 2028", isCorrect: true},
            {content: "1er au 15 août 2028", isCorrect: false},
            {content: "15 au 31 août 2028", isCorrect: false},
            {content: "1er au 15 septembre 2028", isCorrect: false}
        ]
    },
    {
        title: "Innovation LA 2028",
        content: "Quelle est l'une des principales innovations des JO de Los Angeles 2028 ?",
        answers: [
            {content: "Premier logo olympique dynamique et changeant", isCorrect: true},
            {content: "Première cérémonie sous-marine", isCorrect: false},
            {content: "Premier stade olympique flottant", isCorrect: false},
            {content: "Première mascotte holographique", isCorrect: false}
        ]
    },
    {
        title: "Budget LA 2028",
        content: "Quel est le budget prévisionnel des JO de Los Angeles 2028 ?",
        answers: [
            {content: "6,9 milliards de dollars", isCorrect: true},
            {content: "10 milliards de dollars", isCorrect: false},
            {content: "15 milliards de dollars", isCorrect: false},
            {content: "4 milliards de dollars", isCorrect: false}
        ]
    },
    {
        title: "Sites historiques LA 2028",
        content: "Quel site historique des JO 1984 sera réutilisé en 2028 ?",
        answers: [
            {content: "Le Los Angeles Memorial Coliseum", isCorrect: true},
            {content: "Le Dodger Stadium", isCorrect: false},
            {content: "Le Rose Bowl", isCorrect: false},
            {content: "Le SoFi Stadium", isCorrect: false}
        ]
    },
    {
        title: "JO 2030",
        content: "Quelle ville est favorite pour accueillir les Jeux Olympiques d'hiver 2030 ?",
        answers: [
            {content: "Salt Lake City", isCorrect: true},
            {content: "Sapporo", isCorrect: false},
            {content: "Vancouver", isCorrect: false},
            {content: "Åre-Östersund", isCorrect: false}
        ]
    },
    {
        title: "JO 2032",
        content: "Quelle ville accueillera les Jeux Olympiques d'été 2032 ?",
        answers: [
            {content: "Brisbane", isCorrect: true},
            {content: "Jakarta", isCorrect: false},
            {content: "Doha", isCorrect: false},
            {content: "Istanbul", isCorrect: false}
        ]
    }
];

async function importNocRegions(force: boolean = false) {
    console.log("Vérification de l'import NOC regions...");

    if (!force && await checkImportStatus('noc_regions')) {
        console.log("Les données NOC regions existent déjà. Utilisez --force pour réimporter.");
        return;
    }

    console.log("Importing NOC regions...");
    const nocRegionsPath = path.join(CSV_PATH, "noc_regions.csv");

    if (!existsSync(nocRegionsPath)) {
        console.error("Fichier noc_regions.csv non trouvé!");
        return;
    }

    try {
        const fileContent = readFileSync(nocRegionsPath, "utf-8");
        const records = await neatCsv(fileContent);

        // Supprimer les données existantes si force est true
        if (force) {
            await prisma.noc_regions.deleteMany();
        }

        for (const record of records) {
            await prisma.noc_regions.create({
                data: {
                    noc: record.NOC || "",
                    region: record.region || "",
                    notes: record.notes || ""
                }
            });
        }
        importFlags.nocRegions = true;
        console.log("Import NOC regions terminé avec succès!");
    } catch (error) {
        console.error("Erreur lors de l'import des NOC regions:", error);
    }
}

async function importAthleteEvents(force: boolean = false) {
    console.log("Vérification de l'import Athlete Events...");

    if (!force && await checkImportStatus('athlete_events')) {
        console.log("Les données Athlete Events existent déjà. Utilisez --force pour réimporter.");
        return;
    }

    console.log("Importing athlete events...");
    const athleteEventsPath = path.join(CSV_PATH, "athlete_events.csv");

    if (!existsSync(athleteEventsPath)) {
        console.error("Fichier athlete_events.csv non trouvé!");
        return;
    }

    try {
        const fileContent = readFileSync(athleteEventsPath, "utf-8");
        const records = await neatCsv(fileContent);

        if (force) {
            await prisma.athlete_events.deleteMany();
        }

        for (const record of records) {
            await prisma.athlete_events.create({
                data: {
                    name: record.Name,
                    sex: record.Sex,
                    age: record.Age ? parseInt(record.Age) : null,
                    height: record.Height ? parseFloat(record.Height) : null,
                    weight: record.Weight ? parseFloat(record.Weight) : null,
                    team: record.Team,
                    noc: record.NOC,
                    games: record.Games,
                    year: record.Year ? parseInt(record.Year) : null,
                    season: record.Season,
                    city: record.City,
                    sport: record.Sport,
                    event: record.Event,
                    medal: record.Medal
                }
            });
        }
        importFlags.athleteEvents = true;
        console.log("Import athlete events terminé avec succès!");
    } catch (error) {
        console.error("Erreur lors de l'import des athlete events:", error);
    }
}

async function importQuestions(force: boolean = false) {
    console.log("Vérification de l'import Questions...");

    if (!force && await checkImportStatus('Question')) {
        console.log("Les questions existent déjà. Utilisez --force pour réimporter.");
        return;
    }

    console.log("Importing questions...");
    try {
        // Supprimer les données existantes si force est true
        if (force) {
            await prisma.answer.deleteMany();
            await prisma.question.deleteMany();
        }

        for (const question of QUESTIONS) {
            await prisma.question.create({
                data: {
                    title: question.title,
                    content: question.content,
                    answers: {
                        createMany: {
                            data: question.answers
                        }
                    }
                }
            });
        }
        importFlags.questions = true;
        console.log("Import questions terminé avec succès!");
    } catch (error) {
        console.error("Erreur lors de l'import des questions:", error);
    }
}

async function main() {
    const args = process.argv.slice(2);
    const force = args.includes('--force');
    const importType = args.find(arg => arg.startsWith('--import='))?.split('=')[1];

    try {
        if (!importType || importType === 'all') {
            await importNocRegions(force);
            await importAthleteEvents(force);
            await importQuestions(force);
        } else {
            switch (importType) {
                case 'noc':
                    await importNocRegions(force);
                    break;
                case 'athletes':
                    await importAthleteEvents(force);
                    break;
                case 'questions':
                    await importQuestions(force);
                    break;
                default:
                    console.error("Type d'import non reconnu. Utilisez: noc, athletes, questions, ou all");
            }
        }
    } catch (error) {
        console.error("Erreur lors de l'import:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
