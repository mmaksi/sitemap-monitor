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
exports.SitemapParser = void 0;
const node_console_1 = __importDefault(require("node:console"));
// XML Parser as a singleton
const sitemapper_1 = __importDefault(require("sitemapper"));
const DateFormatter_1 = require("../utils/DateFormatter");
class SitemapParser {
    constructor(url) {
        this.url = url;
        this.sitemapData = {
            name: this.domain,
            submissionDate: DateFormatter_1.dateFormatter.getCurrentDate(),
            pages: [],
        };
    }
    get domain() {
        return new URL(this.url).hostname;
    }
    /**
     * Differentiates between different types of sitemap URLs coming from robots.txt.
     *
     * URLs might be sitemap.xml, sitemap.xml.gz or sitemap-index.xml
     */
    extractSitemapPages(sitemapUrls) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            for (const url of sitemapUrls) {
                if (url.endsWith("gz")) {
                    this.sitemapData.pages.push(`The sitemap is too large. Please contact the support team.`);
                }
                // If the sitemapUrl leads to other XML URLs
                if (url.endsWith("xml")) {
                    const sitemapper = new sitemapper_1.default({
                        url,
                        timeout: 15000, // 15 seconds
                    });
                    const { sites } = yield sitemapper.fetch();
                    if (!((_a = sites[0]) === null || _a === void 0 ? void 0 : _a.endsWith("xml"))) {
                        const url = new URL(sites[0]);
                        const domainName = url.hostname;
                        const submissionDate = DateFormatter_1.dateFormatter.getCurrentDate();
                        this.sitemapData = {
                            name: domainName,
                            submissionDate,
                            pages: sites,
                        };
                    }
                    sitemapUrls.push(...sites);
                }
            }
            return this.sitemapData;
        });
    }
    /**
     * Returns all the sitemap URLs found in the robots.txt file no matter how deep they are.
     *
     * URLs might be sitemap.xml, sitemap.xml.gz or sitemap-index.xml
     */
    extractRobotsSitemaps() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const sitemapUrls = [];
            try {
                const response = yield fetch(`https://${this.domain}/robots.txt`);
                const robotsTxt = yield response.text();
                const lines = robotsTxt.split(/\r?\n/);
                for (const line of lines) {
                    if (line.startsWith("Sitemap:") ||
                        (line.startsWith("http:") && line.endsWith(".xml"))) {
                        const sitemapUrl = (_a = line.split(": ")[1]) === null || _a === void 0 ? void 0 : _a.trim();
                        if (sitemapUrl) {
                            sitemapUrls.push(sitemapUrl);
                        }
                    }
                }
            }
            catch (error) {
                node_console_1.default.error(`Error extracting sitemap URLs for ${this.domain}:`, error);
            }
            return sitemapUrls;
        });
    }
}
exports.SitemapParser = SitemapParser;
