import "dotenv/config";
import express from "express";

import userRoutes from "./routes/user-routes.js";

const PORT = process.env.PORT || 5050;
const app = express();

// all users routes
app.use("/user", userRoutes);

app.listen(PORT, () => {
  console.log(`running at http://localhost:${PORT}`);
});
