import program from "commander";
import fs from "fs-extra";
import nanoid from "nanoid";
import path from "path";

import pkg from "../package.json";

program.version(pkg.version);

program
  .command("icode <count>")
  .description("generate icode")
  .option("-f, --file [path]", "file path")
  .action(async (count, options) => {
    const file = path.resolve(process.cwd(), options.file || "icode.txt");
    await fs.ensureFile(file);
    const writeStream = fs.createWriteStream(file);
    console.log(`generating ${count} invitation code`);
    for (let i = 0; i < count; i++) {
      writeStream.write(nanoid(8));
      writeStream.write("\n");
    }
    console.log("done");
  });

program.parse(process.argv);
