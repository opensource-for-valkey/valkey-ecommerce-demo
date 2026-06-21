import { SeedService } from "./seedService";
import { closeValkey } from "../valkey/client";

new SeedService()
  .ensureSeeded()
  .then(() => closeValkey())
  .catch(async (error) => {
    console.error(error);
    await closeValkey();
    process.exit(1);
  });
