"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sitemap_controller_1 = require("./sitemap.controller");
const request_validator_middleware_1 = require("../../middlewares/request-validator.middleware");
const sitemapRouter = express_1.default.Router();
sitemapRouter.post('/sitemap-analyzer', request_validator_middleware_1.requestValidator, request_validator_middleware_1.handleValidationErrors, sitemap_controller_1.httpAnalyzeSitemap);
sitemapRouter.get('/hello', sitemap_controller_1.helloWorld);
exports.default = sitemapRouter;
