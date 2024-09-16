"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./config/database"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api/users", userRoutes_1.default);
const PORT = 3000;
database_1.default
    .sync()
    .then(() => {
    console.log("db connected");
    app.listen(PORT, () => {
        console.log(`Running on Port ${PORT}`);
    });
})
    .catch((err) => {
    console.error("Database connection error:", err);
});
// app.listen(PORT, () => {
//   console.log(`Running on Port ${PORT}`);
// });
