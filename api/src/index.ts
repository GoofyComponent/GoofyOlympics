import bcrypt from "bcrypt";
import express, {Express, json, Request, Response} from "express";
import {body, matchedData, query, validationResult} from "express-validator";
import helmet from "helmet";
import session from "express-session";
import cors from "cors";
import {Server} from 'socket.io';
import {PrismaClient} from '@prisma/client'

import swaggerUi from "swagger-ui-express";
import swaggerJSDocs from "swagger-jsdoc";

import {createServer} from "node:http";

import questionRoutes from './routes/questions';
import authRoutes from './routes/auth';
import athletesRoutes from './routes/athletes';

const prisma = new PrismaClient()
const LIMIT = 10;

const defaultMail = "test@test.test";
const defaultPassword = "testpassword";

try {
    const user = await prisma.users.findUnique({
        where: {
            mail: defaultMail
        }
    });

    if (user === null) {
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);
        await prisma.users.create({
            data: {
                mail: defaultMail,
                password: hashedPassword
            }
        });
    }
} catch (error) {
    console.error("Error executing query", error.stack);
}

const app: Express = express();
const server = createServer(app);
const io = new Server(server);
const port = process.env.PORT || 3000;
const expiryDate = new Date(Date.now() + 60 * 60 * 1000);
const allowedOrigins = [
    "http://localhost:5173",
    "https://goofyolympics.stroyco.eu",
];
app.use(json());
app.use(
    cors({
        credentials: true,
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);
            const originIsAllowed = allowedOrigins.some((allowedOrigin) => {
                return new URL(allowedOrigin).origin === new URL(origin).origin;
            });
            if (!originIsAllowed) {
                var msg = `The CORS policy for this site does not allow access from the specified Origin (${
                    origin || "unknown"
                }).`;
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        },
    })
);
app.use(helmet());
app.disable("x-powered-by");


if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
}
app.use(
    session({
        secret: process.env.SESSION_SECRET || "MySecretIsLame",
        name: "sessionId",
        resave: true,
        saveUninitialized: true,
        cookie: {
            sameSite: "none",
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
            expires: expiryDate,
        },
    })
);

const SWAGGER_OPTIONS = {
    failOnErrors: true,
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Unofficial Olympics API",
            description:
                "An unofficial API for the Olympics, providing data on athletes and regions since 1896 to 2016, data from the Olympics dataset on Kaggle (https://www.kaggle.com/datasets/heesoo37/120-years-of-olympic-history-athletes-and-results).",
            version: "1.0.0",
        },
    },
    apis: ["./src/index.ts"],
};
const swaggerSpec = swaggerJSDocs(SWAGGER_OPTIONS);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /:
 *   get:
 *     summary: Page d'accueil de l'API
 *     responses:
 *       200:
 *         description: Message de bienvenue
 */
app.get("/", (req: Request, res: Response) => {
    res.send(
        "Welcome to the unofficial Olympics API, please use the /api endpoint to access the data. For more information, visit: https://api-olympics.stroyco.eu/api-docs/"
    );
});


/**
 * @swagger
 * /api/regions:
 *   get:
 *     summary: Récupère une liste de regions du NOC (National Olympic Committee)
 *     parameters:
 *       - in: query
 *         name: page
 *         required: true
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: La page à récupérer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 50
 *         description: Le nombre de régions à récupérer par page
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: L'identifiant de la région
 *       - in: query
 *         name: noc
 *         schema:
 *           type: string
 *         description: Le NOC (National Olympic Committee) de la région
 *       - in: query
 *         name: region
 *         schema:
 *           type: string
 *         description: Le nom du Pays
 *       - in: query
 *         name: notes
 *         schema:
 *           type: string
 *         description: Notes sur la région
 *     responses:
 *       200:
 *         description: Une liste de régions
 *       500:
 *         description: Erreur interne du serveur
 */
app.get(
    "/api/regions",
    query("page").default(1).isInt({min: 1}).escape(),
    query("limit").default(LIMIT).isInt({max: 50}).escape(),
    query(["id", "noc", "region", "notes"]).optional().escape(),
    async (req: Request, res: Response) => {
        const result = validationResult(req);
        if (result.isEmpty()) {
            const data = matchedData(req);
            const page = data.page;
            const offset = (page - 1) * LIMIT;
            const limit = data.limit;
            let regions: any;

            let query = "SELECT * FROM noc_regions";
            let conditions: string[] = [];
            let values: string[] = [];
            let i = 1;
            for (const key in data) {
                if (key !== "page" && key !== "limit") {
                    conditions.push(`${key} = $${i}`);
                    values.push(data[key]);
                    i++;
                }
            }
            if (conditions.length > 0) {
                query += " WHERE " + conditions.join(" AND ");
            }
            query += ` LIMIT ${limit} OFFSET ${offset}`;

            try {
                regions = await prisma.$queryRawUnsafe(query, values);
            } catch (error) {
                console.error("Error executing query", error.stack);
                return res.status(500).send("Internal Server Error");
            }

            return res.send({
                regions: regions,
                currentPage: page,
                currentLimit: limit,
            });
        }
        return res.send({errors: result.array()});
    }
);

/**
 * @swagger
 * /api/medals:
 *   get:
 *     summary: Récupère une liste de médailles
 *     parameters:
 *       - in: query
 *         name: noc
 *         schema:
 *           type: string
 *         description: Filtrer par NOC (National Olympic Committee)
 *     responses:
 *       200:
 *         description: Une liste de médailles
 *       500:
 *         description: Erreur interne du serveur
 */
app.get(
    "/api/medals",
    query(["noc"]).optional().escape(),
    async (req: Request, res: Response) => {
        const result = validationResult(req);
        if (result.isEmpty()) {
            const data = matchedData(req);
            let values: string[] = [];
            let medals: any;

            let query =
                "SELECT count(medal), medal, noc FROM public.athlete_events GROUP BY medal, noc";

            if (data.noc) {
                query += " HAVING noc = $1";
                values.push(data.noc.toUpperCase());
            }

            try {
                medals = await prisma.$queryRawUnsafe(query, values);
            } catch (error) {
                console.error("Error executing query", error.stack);
                return res.status(500).send("Internal Server Error");
            }

            let pays: any = {};
            medals.rows.forEach((element: any) => {
                pays[element.noc] = pays[element.noc] || [];
                if (element.medal === "NA") {
                    return;
                }

                pays[element.noc].push({
                    medal: element.medal,
                    count: element.count,
                });
            });

            return res.send({
                medals: pays,
            });
        }
        return res.send({errors: result.array()});
    }
);

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Récupère une liste d'événements
 *     description: Récupère une liste paginée d'événements en fonction des paramètres de requête fournis.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Le numéro de la page à récupérer.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 200
 *           maximum: 200
 *         description: Le nombre d'événements à récupérer par page.
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: L'identifiant de l'événement.
 *       - in: query
 *         name: sport
 *         schema:
 *           type: string
 *         description: Le sport de l'événement.
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Le type de l'événement.
 *       - in: query
 *         name: teams
 *         schema:
 *           type: string
 *         description: Les équipes de l'événement.
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: L'emplacement de l'événement.
 *       - in: query
 *         name: code_site
 *         schema:
 *           type: string
 *         description: Le code du site de l'événement.
 *       - in: query
 *         name: code_sport
 *         schema:
 *           type: string
 *         description: Le code du sport de l'événement.
 *       - in: query
 *         name: for_medal
 *         schema:
 *           type: string
 *         description: Si l'événement est pour une médaille.
 *       - in: query
 *         name: medal_type
 *         schema:
 *           type: string
 *         description: Le type de médaille de l'événement.
 *       - in: query
 *         name: time
 *         schema:
 *           type: string
 *         description: L'heure de l'événement.
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *         description: La date de l'événement.
 *       - in: query
 *         name: timestamp
 *         schema:
 *           type: string
 *         description: Le timestamp de l'événement.
 *     responses:
 *       200:
 *         description: Une liste d'événements
 *       500:
 *         description: Erreur interne du serveur
 */
app.get(
    "/api/events",
    query("page").default(1).isInt({min: 1}).escape(),
    query("limit").default(200).isInt({max: 200}).escape(),
    query([
        "id",
        "sport",
        "type",
        "teams",
        "location",
        "code_site",
        "code_sport",
        "for_medal",
        "medal_type",
        "time",
        "date",
        "timestamp",
    ])
        .optional()
        .escape(),
    async (req: Request, res: Response) => {
        const result = validationResult(req);
        if (result.isEmpty()) {
            const data = matchedData(req);
            const page = data.page;
            const offset = (page - 1) * LIMIT;
            const limit = data.limit;
            let events: any;

            let query = "SELECT * FROM events";
            let conditions: string[] = [];
            let values: string[] = [];
            let i = 1;
            for (const key in data) {
                if (key !== "page" && key !== "limit") {
                    conditions.push(`${key} = $${i}`);
                    values.push(data[key]);
                    i++;
                }
            }
            if (conditions.length > 0) {
                query += " WHERE " + conditions.join(" AND ");
            }
            query += ` LIMIT ${limit} OFFSET ${offset}`;

            try {
                events = await prisma.$queryRawUnsafe(query, values);
            } catch (error) {
                console.error("Error executing query", error.stack);
                return res.status(500).send("Internal Server Error");
            }

            return res.send({
                events: events,
                currentPage: page,
                currentLimit: limit,
            });
        }

        return res.send({errors: result.array()});
    }
);

// Routes
app.use('/api/questions', questionRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/athletes', athletesRoutes);

io.on('event', (socket) => {
    console.log('a user connected');
    socket.on('chat_message', async (msg) => {
        let result;
        try {
            // result = await db.run('INSERT INTO messages (content) VALUES (?)', msg);
        } catch (e) {
            // TODO handle the failure
            return;
        }
        // include the offset with the message
        io.emit('chat_message', msg);
    });

    socket.on('submit_answer', async (data: { questionId: number, answerId: number, userId: number }) => {
        try {
            const response = await prisma.userResponse.create({
                data: {
                    userId: data.userId,
                    questionId: data.questionId,
                    answerId: data.answerId
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            mail: true
                        }
                    },
                    answer: true
                }
            });

            // Émission de la réponse à tous les clients connectés
            io.emit('new_response', response);

        } catch (error) {
            console.error('Erreur lors de l\'enregistrement de la réponse:', error);
            socket.emit('answer_error', {message: "Erreur lors de l'enregistrement de la réponse"});
        }
    });


    socket.on('disconnect', () => {
        console.log('Un utilisateur s\'est déconnecté');
    });
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

process.on("exit", async () => {
    process.exit();
});
process.on("SIGINT", async () => {
    process.exit();
});
process.on("SIGTERM", async () => {
    process.exit();
});
