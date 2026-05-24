import { nanoid } from "nanoid";
import { cartService } from "./cart.service.js";
import { productService } from "./product.service.js";
import { valkey } from "./valkey.service.js";
import { HttpError } from "../utils/httpError.js";

const orderKey = (id) => `order:${id}`;
const userOrdersKey = (identity) => `orders:${identity}`;

class OrderService {
  async checkout(identity, payload) {
    const cart = await cartService.get(identity);
    if (!cart.items.length) throw new HttpError(400, "Cart is empty");

    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        throw new HttpError(409, `${item.product.name} does not have enough stock`);
      }
    }

    const order = {
      id: `ord-${nanoid(10)}`,
      identity,
      status: "processing",
      paymentStatus: "authorized_placeholder",
      paymentProvider: payload.paymentProvider || "manual-placeholder",
      customer: payload.customer,
      shippingAddress: payload.shippingAddress,
      items: cart.items,
      totals: cart.totals,
      tracking: [
        {
          status: "processing",
          label: "Order received",
          timestamp: new Date().toISOString()
        }
      ],
      invoice: {
        number: `INV-${new Date().getFullYear()}-${nanoid(6).toUpperCase()}`,
        issuedAt: new Date().toISOString()
      },
      createdAt: new Date().toISOString()
    };

    for (const item of cart.items) {
      await productService.adjustInventory(item.product.id, -item.quantity);
    }

    await valkey.setJson(orderKey(order.id), order, 60 * 60 * 24 * 365);
    const existing = (await valkey.getJson(userOrdersKey(identity))) || [];
    await valkey.setJson(userOrdersKey(identity), [order.id, ...existing], 60 * 60 * 24 * 365);
    await cartService.clear(identity);
    return order;
  }

  async list(identity) {
    const ids = (await valkey.getJson(userOrdersKey(identity))) || [];
    const orders = await Promise.all(ids.map((id) => valkey.getJson(orderKey(id))));
    return orders.filter(Boolean);
  }

  async get(id) {
    const order = await valkey.getJson(orderKey(id));
    if (!order) throw new HttpError(404, "Order not found");
    return order;
  }

  async updateStatus(id, status) {
    const order = await this.get(id);
    order.status = status;
    order.tracking.push({
      status,
      label: status.replaceAll("_", " "),
      timestamp: new Date().toISOString()
    });
    await valkey.setJson(orderKey(id), order, 60 * 60 * 24 * 365);
    return order;
  }
}

export const orderService = new OrderService();

