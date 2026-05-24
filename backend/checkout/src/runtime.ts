import { type Server } from "node:http";
import {
  assertValkeyReachable,
  createValkeyClientFromConnection,
  createValkeyConnection,
} from "./connection";
import { loadConfig, type CheckoutConfig } from "./config";
import { createEmbeddingClient } from "./embeddings";
import { InventoryScripts } from "./inventoryScripts";
import { startOpenSearchForwarder, type OpenSearchForwarder } from "./observability";
import { createQueueRuntime, type QueueRuntime } from "./queues";
import { createCheckoutApp } from "./server";
import { ensureProductVectorIndex, upsertProductEmbeddings } from "./search";
import { seedCoupons } from "./cart";
import { ensureSeedCatalog } from "./catalog";
import { seedDelivery } from "./delivery";
import { seedEngagement } from "./engagement";
import { listProducts } from "./store";

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

  const embeddingClient = createEmbeddingClient(config.embeddingServiceUrl);
  await ensureSeedCatalog(client);
  await seedCoupons(client);
  await seedEngagement(client);
  await seedDelivery(client);
  const products = await listProducts(client);
  await upsertProductEmbeddings(client, products, embeddingClient.embedText);
  await ensureProductVectorIndex(client);

  const queues = await createQueueRuntime(connection, client, scripts, config);
  const openSearchForwarder: OpenSearchForwarder = startOpenSearchForwarder(client, config);
  const app = createCheckoutApp({
    client,
    scripts,
    queues: queues.queues,
    events: queues.events,
    config,
    embedText: embeddingClient.embedText,
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
        server.closeIdleConnections?.();
        server.closeAllConnections?.();
        await new Promise<void>((resolve, reject) => {
          server!.close((error) => (error ? reject(error) : resolve()));
        });
        server = null;
      }
      openSearchForwarder.close();
      await queues.close();
      await client.quit();
    },
  };
}
