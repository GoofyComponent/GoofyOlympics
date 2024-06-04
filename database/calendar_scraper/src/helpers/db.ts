import pg from "pg";

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

export const createClient = () => {
  console.log("Creating client");
  return new Client(dbConfig);
};

export const openClient = async (client: pg.Client) => {
  try {
    await client.connect();
  } catch (error) {
    console.error("Error connecting to database", error);
    process.exit(1);
  }
  console.log("Connected to database");
};

export const closeClient = async (client: pg.Client) => {
  try {
    await client.end();
  } catch (error) {
    console.error("Error closing connection", error);
  }
  console.log("Connection closed");
};
