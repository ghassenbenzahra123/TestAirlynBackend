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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userModel_1 = __importDefault(require("../models/userModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const router = express_1.default.Router();
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const password = req.body.password;
        const salt = yield bcryptjs_1.default.genSaltSync(10);
        const hashedPassword = yield bcryptjs_1.default.hashSync(password, salt);
        req.body.password = hashedPassword;
        const existingUser = yield userModel_1.default.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(200).send({ message: "User already exists", success: false });
        }
        const user = new userModel_1.default(req.body);
        yield user.save();
        return res
            .status(200)
            .send({ message: "User registered successfully", success: true });
    }
    catch (error) {
        const err = error;
        return res.status(500).send({ message: err.message, success: false });
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.default.findOne({ email: req.body.email });
        if (!user) {
            return res.status(200).send({ message: "User does not exist", success: false });
        }
        const passwordsMatched = yield bcryptjs_1.default.compareSync(req.body.password, user.password);
        if (passwordsMatched) {
            const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.SECRET_KEY, {
                expiresIn: "1d",
            });
            return res.status(200).send({
                message: "User logged in successfully",
                success: true,
                data: token,
            });
        }
        else {
            return res
                .status(200)
                .send({ message: "Password is incorrect", success: false });
        }
    }
    catch (error) {
        const err = error;
        return res.status(500).send({ message: err.message, success: false });
    }
}));
router.post("/get-user-data", authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.default.findById(req.body.userId).select("-password");
        if (!user) {
            return res.status(404).send({ message: "User not found", success: false });
        }
        return res.status(200).send({
            message: "User data fetched successfully",
            success: true,
            data: user,
        });
    }
    catch (error) {
        const err = error;
        return res.status(500).send({ message: err.message, success: false });
    }
}));
exports.default = router;
