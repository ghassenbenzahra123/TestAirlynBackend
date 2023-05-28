"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const songModel_1 = __importDefault(require("../models/songModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const router = express_1.default.Router();
router.post("/get-all-songs", authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const songs = yield songModel_1.default.find();
        res.status(200).send({
            message: "Songs fetched successfully",
            success: true,
            data: songs,
        });
    }
    catch (error) {
        res.status(500).send({ message: "Error fetching songs", success: false, data: error });
    }
}));
router.post("/add-playlist", authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.default.findById(req.body.userId);
        if (!user) {
            res.status(404).send({ message: "User not found", success: false });
            return;
        }
        const existingPlaylists = user.playlists;
        existingPlaylists.push({
            name: req.body.name,
            songs: req.body.songs,
        });
        const updatedUser = yield userModel_1.default.findByIdAndUpdate(req.body.userId, {
            playlists: existingPlaylists,
        }, { new: true });
        res.status(200).send({
            message: "Playlist created successfully",
            success: true,
            data: updatedUser,
        });
    }
    catch (error) {
        res.status(500).send({
            message: "Error creating playlist",
            success: false,
            data: error,
        });
    }
}));
router.post("/update-playlist", authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.default.findById(req.body.userId);
        if (!user) {
            res.status(404).send({ message: "User not found", success: false });
            return;
        }
        let existingPlaylists = user.playlists;
        existingPlaylists = existingPlaylists.map((playlist) => {
            if (playlist.name === req.body.name) {
                playlist.songs = req.body.songs;
            }
            return playlist;
        });
        const updatedUser = yield userModel_1.default.findByIdAndUpdate(req.body.userId, {
            playlists: existingPlaylists,
        }, { new: true });
        res.status(200).send({
            message: "Playlist updated successfully",
            success: true,
            data: updatedUser,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error updating playlist",
            success: false,
            data: error,
        });
    }
}));
router.post("/delete-playlist", authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.default.findById(req.body.userId);
        if (!user) {
            res.status(404).send({ message: "User not found", success: false });
            return;
        }
        let existingPlaylists = user.playlists;
        existingPlaylists = existingPlaylists.filter((playlist) => {
            if (playlist.name === req.body.name) {
                return false;
            }
            return true;
        });
        const updatedUser = yield userModel_1.default.findByIdAndUpdate(req.body.userId, {
            playlists: existingPlaylists,
        }, { new: true });
        res.status(200).send({
            message: "Playlist deleted successfully",
            success: true,
            data: updatedUser,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error deleting playlist",
            success: false,
            data: error,
        });
    }
}));
exports.default = router;
