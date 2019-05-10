import moment from "moment";
import Product from "../models/product";

export default async function initProducts() {
  await Product.findOneAndUpdate(
    { slug: "dushuli2019" },
    {
      slug: "dushuli2019",
      price: "0.01",
      name: "读书历2019",
      description: "读书历2019",
      start: moment("2019-01-01")
        .startOf("day")
        .toDate(),
      end: moment("2019-12-31")
        .endOf("day")
        .toDate(),
      published: true,
      publishedAt: new Date(),
      deleted: false,
    },
    {
      new: true,
      upsert: true,
    }
  );
}
