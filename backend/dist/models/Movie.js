"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Movie extends sequelize_1.Model {
}
Movie.init({
    movieID: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    releaseYear: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    rating: {
        type: sequelize_1.DataTypes.FLOAT,
    },
    thumbnailUrl: {
        type: sequelize_1.DataTypes.STRING(255),
    },
    votes: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    duration: {
        type: sequelize_1.DataTypes.FLOAT,
    },
    type: {
        type: sequelize_1.DataTypes.ENUM("Film", "Series"),
        allowNull: false,
    },
    certificate: {
        type: sequelize_1.DataTypes.STRING(10),
    },
    episodes: {
        type: sequelize_1.DataTypes.INTEGER,
    },
    nudity: {
        type: sequelize_1.DataTypes.ENUM("Mild", "Moderate", "Severe", "No Rate"),
    },
    violence: {
        type: sequelize_1.DataTypes.ENUM("Mild", "Moderate", "Severe", "No Rate"),
    },
    profanity: {
        type: sequelize_1.DataTypes.ENUM("Mild", "Moderate", "Severe", "No Rate"),
    },
    alcohol: {
        type: sequelize_1.DataTypes.ENUM("Mild", "Moderate", "Severe", "No Rate"),
    },
    frightening: {
        type: sequelize_1.DataTypes.ENUM("Mild", "Moderate", "Severe", "No Rate"),
    },
}, {
    sequelize: database_1.default,
    modelName: "Movie",
    tableName: "Movie",
    timestamps: false,
});
exports.default = Movie;
