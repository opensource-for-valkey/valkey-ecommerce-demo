// Entity ID helpers. IDs follow the `domain:uuidv7` contract from HACKATHON.md
// so this backend stays compatible with the eventual Valkey migration.

const { v7: uuidv7 } = require("uuid");

const DOMAINS = new Set([
    "user",
    "product",
    "category",
    "vendor",
    "order",
    "addr",
    "ad",
    "session",
]);

function createId(domain) {
    if (!DOMAINS.has(domain)) {
        throw new Error(`Unknown id domain: ${domain}`);
    }
    return `${domain}:${uuidv7()}`;
}

function parseId(id) {
    if (typeof id !== "string") return null;
    const i = id.indexOf(":");
    if (i < 0) return null;
    return { domain: id.slice(0, i), uuid: id.slice(i + 1) };
}

module.exports = { createId, parseId };
