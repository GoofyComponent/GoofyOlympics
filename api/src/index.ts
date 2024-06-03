import bcrypt from "bcrypt";

import express, { Express, Request, Response, json } from "express";
import { body, matchedData, query, validationResult } from "express-validator";
import helmet from "helmet";
import session from "express-session";
import cors from "cors";

import swaggerUi from "swagger-ui-express";
import swaggerJSDocs from "swagger-jsdoc";

import pg from "pg";

const LIMIT = 10;
let dbConfig: object;
if (process.env.NODE_ENV === "production") {
  dbConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || "5432"),
    timezone: "UTC",
  };
} else {
  dbConfig = {
    user: "postgres",
    password: "postgres",
    host: "localhost",
    port: 5438,
    database: "goofy_olympics",
    timezone: "UTC",
  };
}

const { Client } = pg;
pg.types.setTypeParser(pg.types.builtins.DATE, (value) => {
  return value;
});
pg.types.setTypeParser(pg.types.builtins.TIMESTAMP, (value) => {
  return value;
});
const client = new Client(dbConfig);
await client.connect();

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    mail VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
  )
`;
const checkUserQuery = "SELECT * FROM users WHERE mail = $1";
const insertQuery = "INSERT INTO users (mail, password) VALUES ($1, $2)";
const defaultMail = "test@test.test";
const defaultPassword = "testpassword";

try {
  await client.query(createTableQuery);
  const user = await client.query(checkUserQuery, [defaultMail]);
  if (user.rows.length === 0) {
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    await client.query(insertQuery, [defaultMail, hashedPassword]);
  }
} catch (error) {
  console.error("Error executing query", error.stack);
}

const app: Express = express();
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
 * /protected:
 *   get:
 *     summary: Récupère du contenu protégé
 *     description: Renvoie du contenu protégé si l'utilisateur est connecté
 *     responses:
 *       200:
 *         description: L'utilisateur est connecté et a accès au contenu protégé
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Protected content
 *       401:
 *         description: Non autorisé
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Unauthorized
 */
app.get("/protected", (req: Request, res: Response) => {
  // @ts-expect-error - Session not typed on Request
  if (req.session.userId) {
    return res.send("Protected content");
  }

  return res.status(401).send("Unauthorized");
});

/**
 * @swagger
 * /api/athletes:
 *   get:
 *     summary: Récupère une liste d'athlètes
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
 *         description: Le nombre d'athlètes à récupérer par page
 *       - in: query
 *         name: id
 *         schema:
 *          type: string
 *         description: L'identifiant de l'athlète
 *       - in: query
 *         name: name
 *         schema:
 *          type: string
 *         description: Filtrer par nom
 *       - in: query
 *         name: sex
 *         schema:
 *          type: string
 *         description: Filtrer par sexe
 *       - in: query
 *         name: age
 *         schema:
 *          type: string
 *         description: Filtrer par âge
 *       - in: query
 *         name: team
 *         schema:
 *          type: string
 *         description: Filtrer par équipe
 *       - in: query
 *         name: noc
 *         schema:
 *          type: string
 *         description: Filtrer par NOC (National Olympic Committee)
 *       - in: query
 *         name: games
 *         schema:
 *          type: string
 *         description: Filtrer par jeux olympiques
 *       - in: query
 *         name: year
 *         schema:
 *          type: string
 *         description: Filtrer par année des jeux olympiques
 *       - in: query
 *         name: season
 *         schema:
 *          type: enum
 *          enum: [Summer, Winter]
 *         description: Filtrer par saison des jeux olympiques (été ou hiver)
 *       - in: query
 *         name: city
 *         schema:
 *          type: string
 *         description: Filtrer par ville hôte des jeux olympiques
 *       - in: query
 *         name: sport
 *         schema:
 *          type: string
 *         description: Filtrer par sport
 *       - in: query
 *         name: event
 *         schema:
 *          type: string
 *         description: Filtrer par événement
 *       - in: query
 *         name: medal
 *         schema:
 *           type: enum
 *           enum: [Gold, Silver, Bronze]
 *         description: Filtrer par médaille
 *       - in: query
 *         name: height
 *         schema:
 *           type: integer
 *         description: Filtrer par taille
 *       - in: query
 *         name: weight
 *         schema:
 *           type: integer
 *         description: Filtrer par poids
 *       - in: query
 *         name: optionSort
 *         schema:
 *           type: enum
 *           enum: [less, more, equal]
 *           default: equal
 *         description: L'option de tri pour la taille et le poids
 *     responses:
 *       200:
 *         description: Une liste d'athlètes
 *       500:
 *         description: Erreur interne du serveur
 */
app.get(
  "/api/athletes",
  query("page").default(1).isInt({ min: 1 }).escape(),
  query("limit").default(LIMIT).isInt({ max: 50 }).escape(),
  query([
    "id",
    "name",
    "sex",
    "age",
    "team",
    "noc",
    "games",
    "year",
    "season",
    "city",
    "sport",
    "event",
    "medal",
  ])
    .optional()
    .escape(),
  query("height").optional().isInt().escape(),
  query("weight").optional().isInt().escape(),
  query("optionSort").optional().isIn(["less", "more", "equal"]).escape(),
  async (req: Request, res: Response) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
      const data = matchedData(req);
      const page = data.page;
      const offset = (page - 1) * LIMIT;
      const limit = data.limit;
      //const MAX_PAGE = 271116 / limit;
      let athletes: any;

      if (data.height || data.weight) {
        if (!data.optionSort) {
          data.optionSort = "equal";
        }
      }

      if (data.noc) {
        data.noc = data.noc.toUpperCase();
      }

      let query = "SELECT * FROM athlete_events";
      let conditions: string[] = [];
      let values: string[] = [];
      let i = 1;
      for (const key in data) {
        if (key !== "page" && key !== "limit" && key !== "optionSort") {
          if (key === "height" || key === "weight") {
            let operator = "=";
            if (data.optionSort) {
              switch (data.optionSort) {
                case "less":
                  operator = "<";
                  break;
                case "more":
                  operator = ">";
                  break;
                case "equal":
                  operator = "=";
                  break;
              }
            }
            conditions.push(`${key} ${operator} $${i}`);
          } else {
            conditions.push(`${key} = $${i}`);
          }
          values.push(data[key]);
          i++;
        }
      }
      if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
      }
      query += ` LIMIT ${limit} OFFSET ${offset}`;

      try {
        athletes = await client.query(query, values);
      } catch (error) {
        console.error("Error executing query", error.stack);
        return res.status(500).send("Internal Server Error");
      }

      return res.send({
        athletes: athletes.rows,
        currentPage: page,
        currentLimit: limit,
      });
    }
    return res.send({ errors: result.array() });
  }
);

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
  query("page").default(1).isInt({ min: 1 }).escape(),
  query("limit").default(LIMIT).isInt({ max: 50 }).escape(),
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
        regions = await client.query(query, values);
      } catch (error) {
        console.error("Error executing query", error.stack);
        return res.status(500).send("Internal Server Error");
      }

      return res.send({
        regions: regions.rows,
        currentPage: page,
        currentLimit: limit,
      });
    }
    return res.send({ errors: result.array() });
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
        medals = await client.query(query, values);
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
    return res.send({ errors: result.array() });
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
  query("page").default(1).isInt({ min: 1 }).escape(),
  query("limit").default(200).isInt({ max: 200 }).escape(),
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
        events = await client.query(query, values);
      } catch (error) {
        console.error("Error executing query", error.stack);
        return res.status(500).send("Internal Server Error");
      }

      return res.send({
        events: events.rows,
        currentPage: page,
        currentLimit: limit,
      });
    }

    return res.send({ errors: result.array() });
  }
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Connecte un utilisateur existant
 *     description: Connecte un utilisateur avec un email et un mot de passe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: L'email de l'utilisateur
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: Le mot de passe de l'utilisateur
 *                 example: password123
 *     responses:
 *       200:
 *         description: L'utilisateur est connecté avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Logged in
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur interne du serveur
 */
app.post(
  "/auth/login",
  body("email").isEmail().trim().escape(),
  body("password").isLength({ min: 6 }).escape(),
  async (req: Request, res: Response) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
      const data = matchedData(req);

      let user: any;
      let query = "SELECT * FROM users WHERE mail = $1";

      try {
        user = await client.query(query, [data.email]);
      } catch (error) {
        console.error("Error executing query", error.stack);
        return res.status(500).send("Internal Server Error");
      }

      if (user.rows.length > 0) {
        const match = await bcrypt.compare(
          data.password,
          user.rows[0].password
        );
        if (match) {
          // @ts-expect-error - Session not typed on Request
          req.session.userId = user.rows[0].id;
          return res.send("Logged in");
        }
      }

      return res.status(401).send({
        status: "Unauthorized",
        reason: "Invalid email or password",
      });
    }
    return res.send({ errors: result.array() });
  }
);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Enregistre un nouvel utilisateur
 *     description: Crée un nouvel utilisateur avec un email et un mot de passe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: L'email de l'utilisateur
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: Le mot de passe de l'utilisateur
 *                 example: password123
 *     responses:
 *       200:
 *         description: L'utilisateur a été créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: User created
 *                 user:
 *                   type: string
 *                   example: user@example.com
 *       403:
 *         description: L'enregistrement est actuellement fermé
 *       500:
 *         description: Erreur interne du serveur
 */
app.post(
  "/auth/register",
  body("email")
    .isEmail()
    .trim()
    .escape()
    .custom(async (value) => {
      let user: any;
      let query = "SELECT * FROM users WHERE mail = $1";

      try {
        user = await client.query(query, [value]);
      } catch (error) {
        console.error("Error executing query", error.stack);
        return Promise.reject("Internal Server Error");
      }

      if (user.rows.length > 0) {
        return Promise.reject("Email already in use");
      }
    }),
  body("password").isLength({ min: 6 }).escape(),
  async (req: Request, res: Response) => {
    const IS_REGISTER_OPEN = process.env.IS_REGISTER_OPEN || true;

    if (!IS_REGISTER_OPEN) {
      return res.status(403).send("Forbidden");
    }

    const result = validationResult(req);
    if (result.isEmpty()) {
      const data = matchedData(req);

      let insertQuery = "INSERT INTO users (mail, password) VALUES ($1, $2)";

      try {
        await client.query(createTableQuery);

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await client.query(insertQuery, [
          data.email,
          hashedPassword,
        ]);
      } catch (error) {
        console.error("Error executing query", error.stack);
        return res.status(500).send("Internal Server Error");
      }

      return res.send({
        status: "User created",
        user: data.email,
      });
    }
    return res.send({ errors: result.array() });
  }
);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

process.on("exit", async () => {
  await client.end();
  process.exit();
});
process.on("SIGINT", async () => {
  await client.end();
  process.exit();
});
process.on("SIGTERM", async () => {
  await client.end();
  process.exit();
});
