import { v4 as uuid } from "uuid";

export const id = (prefix: string) => `${prefix}_${uuid().replace(/-/g, "").slice(0, 18)}`;
