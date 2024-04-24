# Processing CSV data into JSON

## 1. Edit CSV file
In the file `src/services/main.ts` edit the variables `inputfile` and `outputfile` to the desired locations.
\
Make sure your `.csv` file is in the format of one of the given csv files in `src/db`.

## 2. Compiling `main.ts`
Navigate to `src/services` and run the following command.
> tsc main.ts 

This compiles the typescript files into javascript.
You can then run the `.js` files with node.
> node main.js