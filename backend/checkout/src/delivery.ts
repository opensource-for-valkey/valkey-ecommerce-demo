import type { Redis } from "ioredis";
import { DELIVERY_TRACKING_FIXTURES, WAREHOUSE_FIXTURES } from "./fixtures";
import { ApiError } from "./errors";
import type { DeliveryStatus, DeliveryTracking, GeoPoint } from "./types";

export const WAREHOUSES_KEY = "warehouses";
export const DELIVERY_AGENTS_KEY = "delivery_agents";
export const SERVICE_RADIUS_KM = 15;
const AVG_SPEED_KMPH = 30;
const DELIVERY_STATUSES: DeliveryStatus[] = ["created", "assigned", "picked_up", "in_transit", "delivered", "failed"];

export function deliveryChannel(trackingId: string): string {
  return `delivery:location:${trackingId}`;
}

export async function seedDelivery(client: Redis): Promise<void> {
  for (const warehouse of WAREHOUSE_FIXTURES) {
    await client.call("GEOADD", WAREHOUSES_KEY, warehouse.lng, warehouse.lat, warehouse.id);
  }

  for (const tracking of DELIVERY_TRACKING_FIXTURES) {
    await saveTracking(client, tracking);
    await client.call("GEOADD", DELIVERY_AGENTS_KEY, tracking.currentLocation.lng, tracking.currentLocation.lat, tracking.agentId);
  }
}

export async function getTracking(client: Redis, trackingId: string): Promise<DeliveryTracking | null> {
  const raw = await client.call("JSON.GET", trackingId, "$");
  if (!raw || typeof raw !== "string") {
    return null;
  }
  return (JSON.parse(raw) as DeliveryTracking[])[0] ?? null;
}

export async function saveTracking(client: Redis, tracking: DeliveryTracking): Promise<void> {
  await client.call("JSON.SET", tracking.trackingId, "$", JSON.stringify(tracking));
}

export async function checkServiceability(client: Redis, point: GeoPoint) {
  const rows = (await client.call(
    "GEOSEARCH",
    WAREHOUSES_KEY,
    "FROMLONLAT",
    point.lng,
    point.lat,
    "BYRADIUS",
    SERVICE_RADIUS_KM,
    "km",
    "ASC",
    "COUNT",
    3,
    "WITHDIST",
    "WITHCOORD"
  )) as Array<[string, string, [string, string]]>;

  const warehouses = rows.map(([warehouseId, distance, coordinates]) => ({
    warehouseId,
    distanceKm: Number(distance),
    lat: Number(coordinates[1]),
    lng: Number(coordinates[0]),
  }));
  return {
    serviceable: warehouses.length > 0,
    radiusKm: SERVICE_RADIUS_KM,
    nearestWarehouse: warehouses[0] ?? null,
    warehouses,
  };
}

export function estimateDelivery(from: GeoPoint, to: GeoPoint) {
  const distanceKm = haversineKm(from, to);
  const minutes = (distanceKm / AVG_SPEED_KMPH) * 60;
  return {
    from,
    to,
    avgSpeedKmph: AVG_SPEED_KMPH,
    distanceKm: Number(distanceKm.toFixed(2)),
    etaMinutes: Math.ceil(minutes),
    estimatedArrival: new Date(Date.now() + minutes * 60_000).toISOString(),
  };
}

export async function updateDeliveryLocation(
  client: Redis,
  trackingId: string,
  input: { point: GeoPoint; status?: DeliveryStatus; agentId?: string }
) {
  const tracking = await getTracking(client, trackingId);
  if (!tracking) {
    throw new ApiError(404, "tracking_not_found", `No delivery found for ${trackingId}.`);
  }
  if (input.status && !DELIVERY_STATUSES.includes(input.status)) {
    throw new ApiError(400, "invalid_status", `status must be one of: ${DELIVERY_STATUSES.join(", ")}`);
  }

  const timestamp = new Date().toISOString();
  const nextTracking: DeliveryTracking = {
    ...tracking,
    agentId: input.agentId ?? tracking.agentId,
    status: input.status ?? tracking.status,
    currentLocation: input.point,
    estimatedArrival: estimateDelivery(input.point, tracking.dropLocation).estimatedArrival,
    history: [
      ...tracking.history,
      { status: input.status ?? tracking.status, timestamp, lat: input.point.lat, lng: input.point.lng },
    ],
  };

  await saveTracking(client, nextTracking);
  await client.call("GEOADD", DELIVERY_AGENTS_KEY, input.point.lng, input.point.lat, nextTracking.agentId);
  const eta = estimateDelivery(input.point, nextTracking.dropLocation);
  await client.publish(
    deliveryChannel(trackingId),
    JSON.stringify({ trackingId, status: nextTracking.status, location: nextTracking.currentLocation, eta, timestamp })
  );
  return { tracking: nextTracking, eta };
}

export function validateGeoPoint(lat: unknown, lng: unknown): GeoPoint | null {
  const parsedLat = Number(lat);
  const parsedLng = Number(lng);
  if (!Number.isFinite(parsedLat) || !Number.isFinite(parsedLng)) {
    return null;
  }
  if (parsedLat < -90 || parsedLat > 90 || parsedLng < -180 || parsedLng > 180) {
    return null;
  }
  return { lat: parsedLat, lng: parsedLng };
}

export function parseGeoPair(value: unknown): GeoPoint | null {
  if (typeof value !== "string") return null;
  const [lat, lng] = value.split(",").map((part) => part.trim());
  return validateGeoPoint(lat, lng);
}

function haversineKm(from: GeoPoint, to: GeoPoint): number {
  const earthRadiusKm = 6371;
  const toRad = (degrees: number) => (degrees * Math.PI) / 180;
  const dLat = toRad(to.lat - from.lat);
  const dLng = toRad(to.lng - from.lng);
  const leftLat = toRad(from.lat);
  const rightLat = toRad(to.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(leftLat) * Math.cos(rightLat);
  return 2 * earthRadiusKm * Math.asin(Math.sqrt(h));
}
