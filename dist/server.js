"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const dbConfig_1 = require("./config/dbConfig");
const path_1 = __importDefault(require("path"));
const body_parser_1 = require("body-parser");
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const songsRoute_1 = __importDefault(require("./routes/songsRoute"));
const adminRoute_1 = __importDefault(require("./routes/adminRoute"));
(0, dotenv_1.config)();
const app = (0, express_1.default)();
app.use((0, body_parser_1.json)());
// Connect to the database
(0, dbConfig_1.connect)();
// Routes
app.use("/api/users", userRoute_1.default);
app.use("/api/songs", songsRoute_1.default);
app.use("/api/admin", adminRoute_1.default);
const port = parseInt(process.env.PORT || "5000");
if (process.env.NODE_ENV === "production") {
    app.use(express_1.default.static(path_1.default.join(__dirname, "client/build")));
    app.get("*", (req, res) => {
        res.sendFile(path_1.default.join(__dirname, "client/build", "index.html"));
    });
}
app.listen(port, () => console.log(`Node.js server started at port ${port}!`));
