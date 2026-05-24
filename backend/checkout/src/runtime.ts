import { type Server } from "node:http";
import {
  assertValkeyReachable,
  createValkeyClientFromConnection,
  createValkeyConnection,
} from "./connection";
import { loadConfig, type CheckoutConfig } from "./config";
import { InventoryScripts } from "./inventoryScripts";
import { createQueueRuntime, type QueueRuntime } from "./queues";
import { createCheckoutApp } from "./server";

export interface CheckoutRuntime {
  app: ReturnType<typeof createCheckoutApp>;
  config: CheckoutConfig;
  queues: QueueRuntime;
  start(port?: number): Promise<Server>;
  close(): Promise<void>;
}

export async function createCheckoutRuntime(env: NodeJS.ProcessEnv = process.env): Promise<CheckoutRuntime> {
  const config = loadConfig(env);
  const connection = createValkeyConnection(env);
  const client = createValkeyClientFromConnection(connection);
  await assertValkeyReachable(client);

  const scripts = new InventoryScripts(client);
  await scripts.load();

  const queues = await createQueueRuntime(connection, client, scripts, config);
  const app = createCheckoutApp({
    client,
    scripts,
    queues: queues.queues,
    events: queues.events,
  });

  let server: Server | null = null;

  return {
    app,
    config,
    queues,
    async start(port = config.port) {
      if (server) {
        return server;
      }

      server = await new Promise<Server>((resolve) => {
        const nextServer = app.listen(port, () => resolve(nextServer));
      });
      return server;
    },
    async close() {
      if (server) {
        await new Promise<void>((resolve, reject) => {
          server!.close((error) => (error ? reject(error) : resolve()));
        });
        server = null;
      }
      await queues.close();
      await client.quit();
    },
  };
}
