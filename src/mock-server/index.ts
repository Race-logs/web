import express from "express";

const app = express();
const port = 3001;

app.use(express.json());

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(port, () => {
  console.log(`Mock server running on http://localhost:${port}`);
});
