import { createValkeyClient } from "./connection";
import { seedProducts } from "./store";

async function main() {
  const client = createValkeyClient();
  try {
    const products = await seedProducts(client);
    console.log(JSON.stringify({ seededProducts: products.length, firstProductId: products[0]?.id }));
  } finally {
    await client.quit();
  }
}

void main();
