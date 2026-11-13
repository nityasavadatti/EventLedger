require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const ruleRoutes = require("./routes/ruleRoutes");
const app = express();
const PORT = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());
app.get("/api/health", (_req, res) => res.json({
  status: "running", engine: "Engine 2 - Logic & Rule",
  mode: mongoose.connection.readyState === 1 ? "mongodb-connected" : "local-demo"
}));
app.use("/api/rules", ruleRoutes);
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Unexpected server error." });
});
async function startServer() {
  if (process.env.MONGODB_URI) {
    try { await mongoose.connect(process.env.MONGODB_URI); console.log("MongoDB connected."); }
    catch (error) { console.error("MongoDB connection failed:", error.message); process.exit(1); }
  } else console.log("MONGODB_URI not set: local demo mode; no database writes.");
  app.listen(PORT, () => console.log(`Engine 2 running at http://localhost:${PORT}`));
}
if (require.main === module) startServer();
module.exports = { app, startServer };
