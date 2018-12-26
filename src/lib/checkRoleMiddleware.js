import fs from "fs";
import path from "path";

import jwt from "jsonwebtoken";
import createError from "http-errors";

const publicKey = fs.readFileSync(
  path.join(__dirname, "../../ssl/rsa_jwt.pub")
);

const CheckRoleMiddleware = async (ctx, next) => {
  const token = ctx.request.header.authorization.split(" ")[1];
  const payload = jwt.verify(token, publicKey);
  const roles = payload.roles
    .join("~")
    .toLowerCase()
    .split("~");
  if (!roles.includes("admin")) {
    throw createError(403, "Permission denied");
  }
  await next();
};

export default CheckRoleMiddleware;
