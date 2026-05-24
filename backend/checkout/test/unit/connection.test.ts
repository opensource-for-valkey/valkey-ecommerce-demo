import { describe, expect, test } from "vitest";
import { createValkeyConnection } from "../../src/connection";

describe("createValkeyConnection", () => {
  test("uses discrete Valkey env vars when VALKEY_URL is absent", () => {
    const connection = createValkeyConnection({
      VALKEY_HOST: "valkey.local",
      VALKEY_PORT: "6380",
      VALKEY_USERNAME: "demo",
      VALKEY_PASSWORD: "secret",
    });

    expect(connection).toMatchObject({
      host: "valkey.local",
      port: 6380,
      username: "demo",
      password: "secret",
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    });
  });

  test("lets VALKEY_URL take precedence", () => {
    const connection = createValkeyConnection({
      VALKEY_URL: "redis://url-user:url-pass@example.com:6390/2",
      VALKEY_HOST: "ignored",
      VALKEY_PORT: "6379",
    });

    expect(connection).toMatchObject({
      host: "example.com",
      port: 6390,
      username: "url-user",
      password: "url-pass",
      db: 2,
    });
  });

  test("enables TLS from either rediss URL or VALKEY_TLS", () => {
    expect(createValkeyConnection({ VALKEY_URL: "rediss://example.com:6379" }).tls).toEqual({});
    expect(createValkeyConnection({ VALKEY_TLS: "true" }).tls).toEqual({});
  });
});
