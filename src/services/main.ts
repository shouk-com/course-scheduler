import * as fs from 'fs';
import { parseTTContent } from "./datamod";

let CSVdata = fs.readFileSync("../db/ttv.csv", "utf-8");

fs.writeFileSync("../db/ttv.json", parseTTContent(CSVdata));