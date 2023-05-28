"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const songSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    artist: {
        type: String,
        required: true,
    },
    album: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    duration: {
        type: String,
        required: true,
    },
    src: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
const Song = mongoose_1.default.model("Song", songSchema);
exports.default = Song;
