import { useQuery } from "@tanstack/react-query";
import { MapPin, Package, Truck } from "@phosphor-icons/react";
import { shopmindApi } from "../api/shopmindClient";
import ShopMindShell from "../components/shopmind/ShopMindShell";
import { useShopMind } from "../providers/ShopMindProvider";

export default function OrdersPage() {
  const { user } = useShopMind();
  const orders = useQuery({ queryKey: ["orders", user?.id], queryFn: () => shopmindApi.orders({ userId: user?.id }) });
  const latest = orders.data?.[0];
  const delivery = useQuery({ queryKey: ["delivery", latest?.id], queryFn: () => shopmindApi.delivery(latest.id), enabled: Boolean(latest?.id) });

  return (
    <ShopMindShell>
      <section className="sm-section-head">
        <h1>Orders and Delivery</h1>
        <p>Checkout events flow through Valkey Streams, while driver progress uses Valkey GEO and Socket.io.</p>
      </section>
      <section className="sm-orders">
        <div>
          {orders.isLoading ? <div className="sm-skeleton" /> : null}
          {orders.data?.length === 0 ? <div className="sm-empty">No orders yet. Add items to cart and check out from the storefront.</div> : null}
          {orders.data?.map((order) => (
            <article className="sm-order" key={order.id}>
              <Package size={22} />
              <div>
                <h2>{order.id}</h2>
                <p>{order.orderStatus} · ₹{order.totals.total.toLocaleString("en-IN")}</p>
              </div>
            </article>
          ))}
        </div>
        <aside className="sm-delivery">
          <Truck size={30} />
          <h2>Live delivery</h2>
          {delivery.data ? (
            <>
              <p>{delivery.data.status}</p>
              <div className="sm-progress">
                <span style={{ width: `${delivery.data.progress}%` }} />
              </div>
              <p>
                <MapPin size={16} /> ETA {delivery.data.etaMinutes} min
              </p>
            </>
          ) : (
            <p>Place an order to see the GEO tracker.</p>
          )}
        </aside>
      </section>
    </ShopMindShell>
  );
}
