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
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpAnalyzeSitemap = httpAnalyzeSitemap;
exports.helloWorld = helloWorld;
const sitemap_model_1 = require("../../models/sitemap/sitemap.model");
const DateFormatter_1 = require("../../utils/DateFormatter");
function httpAnalyzeSitemap(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { user, urls } = req.body;
        const response = yield (0, sitemap_model_1.analyzeSitemapsModel)(user, urls);
        return res.status(201).json({
            message: `Thank you! You will get a report by email on ${DateFormatter_1.dateFormatter.getReportDate()}.`,
        });
    });
}
function helloWorld(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        return res.status(200).json({
            message: `Hello world!`,
        });
    });
}
