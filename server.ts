import express, { Express } from "express";
import { config as dotenvConfig } from "dotenv";
import { connect } from "./config/dbConfig";
import path from "path";
import { json } from "body-parser";
import userRoute from "./routes/userRoute";
import songsRoute from "./routes/songsRoute";
import adminRoute from "./routes/adminRoute";
import cors from "cors";

dotenvConfig();

const app: Express = express();

app.use(json());
app.use(cors());
// Connect to the database
connect();

// Routes
app.use("/api/users", userRoute);
app.use("/api/songs", songsRoute);
app.use("/api/admin", adminRoute);

const port: number = parseInt(process.env.PORT || "5000");

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

app.listen(port, () => console.log(`Node.js server started at port ${port}!`));
export default app;
