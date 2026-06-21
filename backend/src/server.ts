import http from "http";
import { env } from "./config/env";
import { createApp } from "./app";
import { SeedService } from "./seed/seedService";
import { attachSockets } from "./sockets/socketServer";

const start = async () => {
  await new SeedService().ensureSeeded();
  const app = createApp();
  const server = http.createServer(app);
  await attachSockets(server);
  server.listen(env.PORT, () => {
    console.log(`ShopMind AI API running on http://localhost:${env.PORT}`);
    console.log(`Swagger docs: http://localhost:${env.PORT}/api/docs`);
  });
};

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
