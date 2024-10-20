import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));

// this is the octal map for r in each octet and x on each octet
// written in base10, for my ease
// i am asking for read mask in each case as the person checking out the source may not be the person executing it
// NOTE: mask values may exist in Node source already
const UNIX_FILE_ALL_READ_EXEC = 365;
const UNIX_FILE_MASK_RX = parseInt("555", 8); // ie r-xr-xr-x

// patched to modern node, but sourced from from https://stackoverflow.com/questions/21081609/simple-static-html-server-in-node

// TODO: add https, problem, no cert available
// it is limited to LAN is secure by default
const PORT = 8080;
const ACCESSIBLE_IP = "127.0.0.1";

try {
  const staticPath = path.join(__dirname, "..", "dist", "docs");
  const stat = fs.statSync(staticPath);
  if (
    !stat.isDirectory() ||
    (stat.mode & UNIX_FILE_MASK_RX) !== UNIX_FILE_ALL_READ_EXEC
  ) {
    throw new Error("Bad web-root " + staticPath);
  }
  const app = express();
  app.use("/", express.static(staticPath));
  app.listen(PORT, ACCESSIBLE_IP);
  console.log(
    "SUCCESS: Docs service should be accessible as http://" +
      ACCESSIBLE_IP +
      ":" +
      PORT +
      "/ with a local PID of " +
      process.pid,
  );
  console.log("Someone should add HTTPS, but this is the local IP.");
} catch (e) {
  console.error("FAIL " + e.toString());
}
