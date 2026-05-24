import { v7 as uuidv7 } from "uuid";

export function createId(domain: string): string {
  return `${domain}:${uuidv7()}`;
}

export function uuidV7Timestamp(id: string): number {
  const uuid = id.includes(":") ? id.slice(id.indexOf(":") + 1) : id;
  return Number.parseInt(uuid.replaceAll("-", "").slice(0, 12), 16);
}
