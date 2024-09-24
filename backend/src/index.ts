import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/database";
import userRoutes from "./routes/userRoutes";
import movieRoutes from "./routes/movieRoutes";
import watchlistRoutes from "./routes/watchlistRoutes";
import cors from "cors";
// const bodyParser = require("body-parser");

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(express.static("uploads"));

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api", movieRoutes);
app.use("/api", watchlistRoutes);

const PORT = process.env.PORT;

(async () => {
  await sequelize
    .sync()
    .then(() => {
      console.log("db connected");
      app.listen(PORT, () => {
        console.log(`Running on Port ${PORT}`);
      });
    })
    .catch((err: Error) => {
      console.error("Database connection error:", err);
    });
})();
