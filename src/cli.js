import program from "commander";
import fs from "fs-extra";
import path from "path";
import moment from "moment";
import { generate } from "branded-qr-code";
import generateId from "nanoid/generate";

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
      const id = generateId("2345678abcdefhjkmnpqrstuwxyz", 12);
      writeStream.write(id);
      writeStream.write("\r\n");
    }
    console.log("done");
  });

program
  .command("qrcode")
  .description("generate everyday qrcode")
  .action(async () => {
    const start = moment("2019-01-01T12:12:12.000Z");
    const end = moment("2020-01-01T12:12:12.000Z");
    const logo = path.resolve(process.cwd(), "assets/logo.png");

    for (let d = start; d < end; d.add(1, "days")) {
      const name = d.format("YYYYMMDD");
      const url = `https://www.yuewen365.com/read/calendar/${name}`;
      const file = path.resolve(process.cwd(), `build/qrcode/${name}.png`);
      const buf = await generate({
        text: url,
        path: logo,
        ratio: 5,
        opt: { width: 1024 },
      });
      await fs.ensureFile(file);
      await fs.writeFileSync(file, buf);

      // QRCode.toFile(
      //   file,
      //   `https://yuewen365.com/${name}`,
      //   {
      //     color: {
      //       dark: "#000", // Blue dots
      //       light: "#0000", // Transparent background
      //     },
      //   },
      //   function(err) {
      //     if (err) throw err;
      //     console.log("done");
      //   }
      // );
    }
  });

program.parse(process.argv);
