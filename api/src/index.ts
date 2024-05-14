import express, { Express, Request, Response, json } from "express";
import { matchedData, query, validationResult } from "express-validator";
import helmet from "helmet";

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

const app: Express = express();
const port = process.env.PORT || 3000;
app.use(json());
app.use(helmet());
app.disable("x-powered-by");

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
    "Welcome to the unofficial Olympics API, please use the /api endpoint to access the data. For more information, visit: no-url-to-provide.yet"
  );
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
