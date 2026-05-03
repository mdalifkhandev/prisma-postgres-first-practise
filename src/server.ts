import type { Server } from "http";
import app from "./app";
import { env } from "./app/config";

const port = env.port;

async function main() {
  const server: Server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

main();
