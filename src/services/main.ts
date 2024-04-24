import * as fs from 'fs';
import { parseTTContent } from "./datamod";

/**
 * Edit the csv and json destinations before you execute
 */
const inputfile = "../db/ttv.csv";
const outputfile = "../db/ttv.json";


let CSVdata = fs.readFileSync(inputfile, "utf-8");

fs.writeFileSync(outputfile, parseTTContent(CSVdata));