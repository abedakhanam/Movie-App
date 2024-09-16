"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Genre extends sequelize_1.Model {
}
Genre.init({
    genreID: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    genreName: {
        type: sequelize_1.DataTypes.STRING(50),
    },
}, {
    sequelize: database_1.default,
    modelName: "Genre",
    tableName: "Genre",
    timestamps: false,
});
exports.default = Genre;
