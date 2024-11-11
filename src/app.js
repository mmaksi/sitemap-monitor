"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const dotenv_1 = __importDefault(require("dotenv"));
const api_1 = __importDefault(require("./routes/api"));
const common_1 = require("@eventexchange/common");
dotenv_1.default.config();
exports.app = (0, express_1.default)();
// Important middlewares
exports.app.use(express_1.default.json());
// Router mounting
exports.app.use("/api", api_1.default);
// Error handling
exports.app.use(common_1.errorHandler);
