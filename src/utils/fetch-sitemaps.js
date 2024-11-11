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
exports.fetchSitemapPages = void 0;
const aws_1 = require("../services/aws");
const XMLParser_1 = require("../services/XMLParser");
const sitemap_schema_1 = require("./database/sitemap-schema");
const DateFormatter_1 = require("./DateFormatter");
const fetchSitemapPages = (urls, tracked, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const sitemapDataArray = [];
    for (const url of urls) {
        try {
            const sitemapParser = new XMLParser_1.SitemapParser(url); // a parser for every website
            const sitemapUrls = yield sitemapParser.extractRobotsSitemaps(); // from robots.txt
            const sitemapData = yield sitemapParser.extractSitemapPages(sitemapUrls);
            if (tracked) {
                const trackedContent = Object.assign(Object.assign({}, sitemapData), { trackedDate: DateFormatter_1.dateFormatter.formatDate(new Date()) });
                sitemapDataArray.push(trackedContent);
            }
            else {
                sitemapDataArray.push(sitemapData);
            }
            const fileName = `${userId}`;
            yield (0, aws_1.uploadFile)(JSON.stringify(sitemapDataArray), tracked ? `${fileName}-tracked.json` : `${fileName}.json`);
        }
        catch (error) {
            yield (0, sitemap_schema_1.deleteSitemapByUserId)(userId);
            console.error(`Error processing ${url}:`, error);
            return `An error occurred while processing the sitemaps. Please try again.`;
        }
    }
    return `Thank you! You will get a report by email on ${DateFormatter_1.dateFormatter.getReportDate()}.`;
});
exports.fetchSitemapPages = fetchSitemapPages;
