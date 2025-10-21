import { createServer } from "http";
import { readFileSync } from "fs";

const raceResults = JSON.parse(
  readFileSync(new URL("./race_results.json", import.meta.url), "utf-8"),
);

const port = 3001;

const server = createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.url === "/race-results" && req.method === "GET") {
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
