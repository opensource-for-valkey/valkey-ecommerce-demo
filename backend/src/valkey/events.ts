import { getPublisher, getValkey } from "./client";
import { keys } from "./keys";

export class EventBus {
  async publish(channel: string, payload: unknown) {
    const publisher = await getPublisher();
    await publisher.publish(channel, JSON.stringify(payload));
  }

  async addStream(stream: string, payload: Record<string, string | number | boolean>) {
    const client = await getValkey();
    await client.xAdd(stream, "*", Object.fromEntries(Object.entries(payload).map(([k, v]) => [k, String(v)])));
  }

  async recordProductEvent(event: "views" | "clicks" | "carts" | "purchases", productId: string, userId?: string) {
    const client = await getValkey();
    await client.zIncrBy(keys.trend(event), 1, productId);
    if (userId) await client.zIncrBy(keys.personal(userId), event === "purchases" ? 8 : event === "carts" ? 5 : 1, productId);
    await this.addStream(keys.streamAnalytics, { event, productId, userId: userId ?? "guest", at: Date.now() });
    const trending = await client.zRangeWithScores(keys.trend(event), 0, 9, { REV: true });
    await this.publish(keys.pubTrending, { event, products: trending });
  }
}
