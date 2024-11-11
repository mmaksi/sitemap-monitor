"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const http_1 = __importDefault(require("http"));
const hostname = '0.0.0.0';
const port = 80;
http_1.default.createServer(app_1.app).listen(port, hostname, () => {
    console.log('Server running on port 3000');
});
