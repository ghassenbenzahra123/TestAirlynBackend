"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;
        if (authorizationHeader) {
            const token = authorizationHeader.split(" ")[1];
            const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
            if (decoded && decoded.userId) {
                req.body.userId = decoded.userId;
            }
        }
        next();
    }
    catch (error) {
        const err = error;
        res.status(500).send({ message: err.message, success: false });
    }
};
exports.default = authMiddleware;
