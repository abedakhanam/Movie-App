"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const Movie_1 = __importDefault(require("./Movie"));
const Genre_1 = __importDefault(require("./Genre"));
class MovieGenre extends sequelize_1.Model {
}
MovieGenre.init({}, {
    sequelize: database_1.default,
    modelName: "MovieGenre",
    tableName: "MovieGenre",
    timestamps: false,
});
MovieGenre.belongsTo(Movie_1.default, { foreignKey: "movieID" });
MovieGenre.belongsTo(Genre_1.default, { foreignKey: "genreID" });
exports.default = MovieGenre;
