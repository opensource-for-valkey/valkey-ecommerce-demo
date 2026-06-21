import { BellRinging, Broadcast, Package } from "@phosphor-icons/react";
import { useShopMind } from "../../providers/ShopMindProvider";
import { useShopMindSocket } from "../../hooks/useShopMindSocket";

const icons = {
  inventory: Package,
  notification: BellRinging,
  trending: Broadcast,
  order: Package
};

export default function RealtimeDock() {
  const { user } = useShopMind();
  const { events } = useShopMindSocket(user?.id);
  return (
    <section className="sm-realtime" aria-label="Realtime Valkey events">
      <div>
        <span className="sm-dot" />
        <strong>Valkey Live</strong>
      </div>
      {events.length === 0 ? <p>Waiting for inventory, trend, order, and notification events.</p> : null}
      {events.slice(0, 4).map((event) => {
        const Icon = icons[event.type] || Broadcast;
        return (
          <article key={event.id}>
            <Icon size={16} />
            <span>{event.type}</span>
          </article>
        );
      })}
    </section>
  );
}
