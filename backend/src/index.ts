import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/database";
import userRoutes from "./routes/userRoutes";
import movieRoutes from "./routes/movieRoutes";
const cors = require("cors");
// const bodyParser = require("body-parser");

dotenv.config();

const app = express();
// app.use(cors());

// CORS options
// const corsOptions = {
//   origin: "http://localhost:3000", // Specify your frontend's origin
//   credentials: true, // Allow credentials like cookies
// };

app.use(cors({ origin: "http://localhost:3000" }));

app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api", movieRoutes);

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
