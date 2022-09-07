import fs from "fs";
import { nextClass, fromCSV } from "./util.js";

const file = fs.readFileSync("./classes.csv");
const {
  data: { times,classes },
  schedule,
} = fromCSV(file);

console.log(schedule);

export default schedule.flat();
export { times,classes };
