import request from "supertest";
import { createApp } from "../app";

describe("health", () => {
  it("returns service status", async () => {
    const res = await request(createApp()).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});
