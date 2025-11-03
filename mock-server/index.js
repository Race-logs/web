import { createServer } from "http";
import { readFileSync } from "fs";
import { URL } from "node:url";

const raceResults = JSON.parse(
  readFileSync(new URL("./race_results.json", import.meta.url), "utf-8"),
);

const port = 3001;

const normalizePath = (p) =>
  p.endsWith("/") && p !== "/" ? p.slice(0, -1) : p;

const server = createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    res.writeHead(204).end();
    return;
  }

  const base = `http://${req.headers.host || `localhost:${port}`}`;
  const parsed = new URL(req.url || "/", base);
  const pathname = normalizePath(parsed.pathname);

  if (req.method === "GET" && pathname === "/race-results") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(raceResults));
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(port, () => {
  console.log(`Mock server running at http://localhost:${port}`);
});
