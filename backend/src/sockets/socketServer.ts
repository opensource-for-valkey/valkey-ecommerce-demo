import type { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { env } from "../config/env";
import { AiService } from "../modules/ai/ai.service";
import { getSubscriber } from "../valkey/client";
import { EventBus } from "../valkey/events";
import { keys } from "../valkey/keys";

export const attachSockets = async (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: env.FRONTEND_URL,
      credentials: true
    }
  });
  const ai = new AiService();
  const events = new EventBus();
  const sub = await getSubscriber();

  await sub.subscribe(keys.pubInventory, (message) => io.emit("inventory:update", JSON.parse(message)));
  await sub.subscribe(keys.pubTrending, (message) => io.emit("trending:update", JSON.parse(message)));

  io.on("connection", (socket) => {
    socket.on("notifications:subscribe", async ({ userId }) => {
      if (!userId) return;
      socket.join(`user:${userId}`);
      await sub.subscribe(keys.pubUserNotifications(userId), (message) => io.to(`user:${userId}`).emit("notification:new", JSON.parse(message)));
    });

    socket.on("order:track", async ({ orderId }) => {
      if (!orderId) return;
      socket.join(`order:${orderId}`);
      await sub.subscribe(keys.pubOrder(orderId), (message) => io.to(`order:${orderId}`).emit("order:update", JSON.parse(message)));
    });

    socket.on("product:view", async ({ productId, userId }) => {
      if (productId) await events.recordProductEvent("views", productId, userId);
    });

    socket.on("ai:chat:message", async ({ message, userId }) => {
      socket.emit("ai:chat:typing", { typing: true });
      const response = await ai.chat(message, userId);
      const tokens = response.message.split(" ");
      for (const token of tokens) socket.emit("ai:chat:token", { token: `${token} ` });
      socket.emit("ai:chat:done", response);
    });
  });

  return io;
};
