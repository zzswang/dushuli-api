import fs from "fs";
import path from "path";
import Koa2 from "koa";
import body from "koa-bodyparser";
import compress from "koa-compress";
import cors from "@koa/cors";
import helmet from "koa-helmet";
import logger from "koa-logger";
import jwt from "koa-jwt";
import mongoose from "mongoose";
import Router from "koa-tree-router";
import health from "koa2-ping";

import { QueryNormalizr } from "@36node/query-normalizr";

import { wechatPayApi } from "./wechat";
import { BASE, MONGODB_CONNECTION, WECHAT } from "./config";

import wechatService from "./services/wechat";
import productService from "./services/product";
import orderService from "./services/order";
import memberService from "./services/member";
import settingService from "./services/setting";
import statsService from "./services/stats";
import invitationService from "./services/invitation";
import formIdService from "./services/formId";
import replyService from "./services/reply";

const app = new Koa2();
const router = new Router({ prefix: BASE });
const publicKey = fs.readFileSync(path.join(__dirname, "../ssl/rsa_jwt.pub"));

/**
 * connect to mongodb
 */

mongoose.Promise = Promise;
mongoose.connect(MONGODB_CONNECTION, { useNewUrlParser: true });
mongoose.connection.on("error", console.error.bind(console, "数据库连接错误"));

/**
 * register services
 */

wechatService.bind(router);
router.post(
  "/wechat/payment-callback",
  wechatPayApi.middleware("pay"),
  wechatService.paymentCallback
);
router.all("/wechat", wechatService.message());
productService.bind(router);
orderService.bind(router);
memberService.bind(router);
settingService.bind(router);
statsService.bind(router);
invitationService.bind(router);
formIdService.bind(router);
replyService.bind(router);

/**
 * spec openapi.yml
 */

router.get("/openapi.yml", ctx => {
  ctx.type = "text/yaml";
  ctx.body = fs.createReadStream(path.join(__dirname, "../openapi.yml"));
});

/**
 * application
 */

const errorHandler = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = err.message;
    ctx.app.emit("error", err, ctx);
  }
};

app
  .use(errorHandler)
  .use(logger())
  .use(helmet())
  .use(cors({ exposeHeaders: "*" }))
  .use(
    jwt({ secret: publicKey }).unless({
      path: [
        `${BASE}/openapi.yml`,
        `${BASE}/health`,
        `${BASE}/wechat`,
        `${BASE}/wechat/payment-callback`,
        `${BASE}/component_verify_ticket`,
        `${BASE}/pre_auth_code`,
        `${BASE}/authorizer_access_token`,
        `${BASE}/${WECHAT.APP_ID}/event`,
      ],
    })
  )
  .use(health(`${BASE}/health`))
  .use(
    body({
      enableTypes: ["json", "form", "text"],
      extendTypes: {
        text: ["text/xml", "application/xml"],
      },
    })
  )
  .use(QueryNormalizr())
  .use(compress({ threshold: 2048 }))
  .use(router.routes());

app.on("error", (err, ctx) => {
  console.error(err);
});

export default app;
