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
const multer_1 = __importDefault(require("multer"));
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const cloudinary_1 = require("../cloudinary");
const songModel_1 = __importDefault(require("../models/songModel"));
const router = express_1.default.Router();
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const upload = (0, multer_1.default)({ storage: storage });
router.post("/add-song", authMiddleware_1.default, upload.single("file"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            throw new Error("File not found");
        }
        const result = yield cloudinary_1.cloudinary.v2.uploader.upload(req.file.path, {
            folder: "test-aero",
            use_filename: true,
            resource_type: "raw",
        });
        const newsong = new songModel_1.default({
            title: req.body.title,
            artist: req.body.artist,
            src: result.url,
            album: req.body.album,
            duration: req.body.duration,
            year: req.body.year,
        });
        yield newsong.save();
        const allSongs = yield songModel_1.default.find();
        res.status(200).send({
            message: "Song added successfully",
            success: true,
            data: allSongs,
        });
    }
    catch (error) {
        res.status(500).send({
            message: "Error adding song",
            success: false,
            data: error,
        });
    }
}));
router.post("/edit-song", authMiddleware_1.default, upload.single("file"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = null;
        if (req.file) {
            response = yield cloudinary_1.cloudinary.v2.uploader.upload(req.file.path, {
                folder: "test-aero",
                use_filename: true,
                resource_type: "raw",
            });
        }
        yield songModel_1.default.findByIdAndUpdate(req.body._id, {
            title: req.body.title,
            artist: req.body.artist,
            src: response ? response.url : req.body.src,
            album: req.body.album,
            duration: req.body.duration,
            year: req.body.year,
        });
        const allSongs = yield songModel_1.default.find();
        res.status(200).send({
            message: "Song edited successfully",
            success: true,
            data: allSongs,
        });
    }
    catch (error) {
        res.status(500).send({
            message: "Error adding song",
            success: false,
            data: error,
        });
    }
}));
exports.default = router;
