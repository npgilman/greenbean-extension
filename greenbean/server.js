import express from 'express';
import { join } from 'path';
const app = express();

// Serve static assets from the /public folder
app.use(express.static(join("./public")));

// Endpoint to serve the configuration file
app.get("/auth_config.json", (req, res) => {
  res.sendFile(join("./auth_config.json"));
});

// Serve the index page for all other requests
app.get("/*", (_, res) => {
  console.log("hit")
  res.sendFile(join("./index.html"));
});

// Listen on port 3000
app.listen(3000, () => console.log("Application running on port 3000"));