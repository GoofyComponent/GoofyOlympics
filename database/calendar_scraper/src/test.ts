//Get object and save them in a file

import { writeFileSync } from "fs";

export const writeToFile = (data: any, filename: string) => {
  const path = `./${filename}`;

  //If path exist we delete it
  try {
    writeFileSync(path, "");
  } catch (e) {
    console.log("File does not exist");
  }

  writeFileSync(path, JSON.stringify(data, null, 2));
};
