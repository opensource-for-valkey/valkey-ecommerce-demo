import { createApp } from "./app.js";
import { config } from "./config/env.js";
import { logger } from "./config/logger.js";
import { authService } from "./services/auth.service.js";
import { valkey } from "./services/valkey.service.js";

const app = createApp();

const start = async () => {
  await valkey.connect();
  await authService.init();

  const server = app.listen(config.port, () => {
    logger.info(`API ready on http://localhost:${config.port}/api/${config.apiVersion}`);
  });

  const shutdown = async () => {
    logger.info("Shutting down API");
    server.close(async () => {
      await valkey.disconnect();
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

start().catch((error) => {
  logger.error("API failed to start", { message: error.message, stack: error.stack });
  process.exit(1);
});

