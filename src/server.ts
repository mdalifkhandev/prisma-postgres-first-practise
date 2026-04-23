import "dotenv/config";
import type { Server } from "http";
import app from "./app";

const port = process.env.PORT || 5001;

async function main() {
  const server: Server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

main();
