import { closeClient, createClient, openClient } from "./db";

export const clearDb = async () => {
  const client = createClient();
  try {
    await openClient(client);
    await client.query("DROP TABLE IF EXISTS events");
  } catch (error) {
    console.error("Error clearing database", error);
  } finally {
    console.log("Database cleared");
  }

  await closeClient(client);
  return;
};
