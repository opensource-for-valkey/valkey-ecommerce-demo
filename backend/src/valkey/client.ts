import { createClient, type RedisClientType } from "redis";
import { env } from "../config/env";

export type ValkeyClient = RedisClientType;

let client: ValkeyClient | null = null;
let subscriber: ValkeyClient | null = null;
let publisher: ValkeyClient | null = null;

const attachLogging = (name: string, instance: ValkeyClient) => {
  instance.on("error", (error) => {
    console.error(`[valkey:${name}]`, error.message);
  });
};

export const getValkey = async () => {
  if (!client) {
    client = createClient({ url: env.VALKEY_URL }) as ValkeyClient;
    attachLogging("client", client);
    await client.connect();
  }
  return client;
};

export const getPublisher = async () => {
  if (!publisher) {
    publisher = createClient({ url: env.VALKEY_URL }) as ValkeyClient;
    attachLogging("publisher", publisher);
    await publisher.connect();
  }
  return publisher;
};

export const getSubscriber = async () => {
  if (!subscriber) {
    subscriber = createClient({ url: env.VALKEY_URL }) as ValkeyClient;
    attachLogging("subscriber", subscriber);
    await subscriber.connect();
  }
  return subscriber;
};

export const closeValkey = async () => {
  await Promise.allSettled([client?.quit(), publisher?.quit(), subscriber?.quit()]);
  client = null;
  publisher = null;
  subscriber = null;
};
