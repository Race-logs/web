import { createServer } from "http";
import { readFileSync } from "fs";
import { URL } from "node:url";

const raceResults = JSON.parse(
  readFileSync(new URL("./race_results.json", import.meta.url), "utf-8"),
);

const port = 3001;

const normalizePath = (p) =>
  p.endsWith("/") && p !== "/" ? p.slice(0, -1) : p;

const server = createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");

  const sendJson = (statusCode, payload) => {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(payload));
  };

  if (req.method === "OPTIONS") {
    res.writeHead(204).end();
    return;
  }

  const base = `http://${req.headers.host || `localhost:${port}`}`;
  const parsed = new URL(req.url || "/", base);
  const pathname = normalizePath(parsed.pathname);

  if (req.method === "GET" && pathname === "/race-results") {
    const delay = (ms) => new Promise((r) => setTimeout(r, ms));
    await delay(2000);

    const shouldFail = Math.random() < 0.1;
    if (shouldFail) {
      sendJson(503, { error: "Temporary upstream failure" });
      return;
    }

    const shuffled = raceResults.sort(() => Math.random() - 0.5);
    const count = Math.max(1, Math.floor(Math.random() * shuffled.length));
    sendJson(200, shuffled.slice(0, count));
    return;
  }

  sendJson(404, { error: "Not found" });
});

server.listen(port, () => {
  console.log(`Mock server running at http://localhost:${port}`);
});
