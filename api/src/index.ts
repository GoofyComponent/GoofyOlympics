import express, { Express, Request, Response, json } from "express";
import { matchedData, query, validationResult } from "express-validator";
import helmet from "helmet";
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

app.get("/", (req: Request, res: Response) => {
  res.send(
    "Welcome to the unofficial Olympics API, please use the /api endpoint to access the data. For more information, visit: no-url-to-provide.yet"
  );
});

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

      console.log("query: ", query);

      try {
        athletes = await client.query(query, values);
      } catch (error) {
        console.error("Error executing query", error.stack);
        return res.status(500).send("Internal Server Error");
      }

      return res.send({
        athletes: athletes.rows,
        currentPage: page,
        //maxPage: MAX_PAGE,
        currentLimit: limit,
      });
    }
    return res.send({ errors: result.array() });
  }
);

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
