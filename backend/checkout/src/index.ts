import { createCheckoutRuntime } from "./runtime";

async function main() {
  try {
    const runtime = await createCheckoutRuntime();
    const server = await runtime.start();
    const address = server.address();
    const port = typeof address === "object" && address ? address.port : runtime.config.port;
    console.log(JSON.stringify({ level: "info", message: "checkout_service_started", port }));

    const shutdown = async () => {
      console.log(JSON.stringify({ level: "info", message: "checkout_service_stopping" }));
      await runtime.close();
      process.exit(0);
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(JSON.stringify({ level: "error", error: "valkey_unreachable", message }));
    process.exit(1);
  }
}

void main();
