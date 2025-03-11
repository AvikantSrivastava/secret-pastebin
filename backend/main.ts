import { Application, Router, connect, nanoid, config } from "./deps.ts";
import { encrypt, decrypt } from "./encryption.ts";

await config({ export: true });

const app = new Application();
const router = new Router();

const redis = await connect({
  hostname: Deno.env.get("REDIS_HOST") || "redis",
  port: parseInt(Deno.env.get("REDIS_PORT") || "6379"),
});

app.use(async (ctx, next) => {
  ctx.response.headers.set("Access-Control-Allow-Origin", "*");
  ctx.response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Accept",
  );
  ctx.response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS",
  );

  if (ctx.request.method === "OPTIONS") {
    ctx.response.status = 204;
    return;
  }

  await next();
});

router.post("/api/create", async (ctx) => {
  const { secret, passphrase } = await ctx.request.body({ type: "json" }).value;

  if (!secret || !passphrase) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Missing secret or passphrase" };
    return;
  }

  const encryptedData = await encrypt(secret, passphrase);
  const id = nanoid(10);

  await redis.setex(id, 3600, JSON.stringify(encryptedData));

  ctx.response.body = {
    slug: id,
  };
});

router.post("/api/secret/:id", async (ctx) => {
  const { id } = ctx.params;
  const { passphrase } = await ctx.request.body({ type: "json" }).value;

  const data = await redis.get(id);

  if (!data) {
    ctx.response.status = 404;
    ctx.response.body = { error: "Secret expired or already viewed" };
    return;
  }

  await redis.del(id);

  try {
    const decrypted = await decrypt(JSON.parse(data), passphrase);
    ctx.response.body = { secret: decrypted };
  } catch {
    ctx.response.status = 403;
    ctx.response.body = { error: "Incorrect passphrase" };
  }
});

router.get("/health", (ctx) => {
  ctx.response.status = 200;
  ctx.response.body = { status: "OK" };
});

app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener("listen", ({ hostname, port }) => {
  console.log(`🚀 Server running on http://${hostname || "localhost"}:${port}`);
});

await app.listen({ port: 8000 });
