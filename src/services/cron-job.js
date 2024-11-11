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
exports.analyzeSitemaps = exports.dynamic = void 0;
exports.sendReport = sendReport;
const puppeteer_1 = __importDefault(require("puppeteer"));
const sitemap_schema_1 = require("../utils/database/sitemap-schema");
const fetch_sitemaps_1 = require("../utils/fetch-sitemaps");
const DateFormatter_1 = require("../utils/DateFormatter");
const aws_1 = require("./aws");
const mailgun_1 = require("./mailgun");
exports.dynamic = "force-dynamic";
function sendReport(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const dbUser = yield (0, sitemap_schema_1.getDatabaseUser)(userId);
        const urls = (yield (0, sitemap_schema_1.getUserWebsites)(userId));
        const titles = yield getTitles(urls);
        const trackedSitemapsArrayFile = `${userId}-tracked.json`;
        const trackedContentString = yield (0, aws_1.readFileFromS3)(trackedSitemapsArrayFile);
        const trackedUserSitemaps = JSON.parse(trackedContentString);
        try {
            // Send the unhashed resetToken via email
            return yield (0, mailgun_1.sendMailgunEmail)(dbUser.email, dbUser.firstName, trackedUserSitemaps, titles);
        }
        catch (_a) {
            throw new Error("Error sending email");
        }
    });
}
function getTitles(urls) {
    return __awaiter(this, void 0, void 0, function* () {
        const titles = [];
        for (let i = 0; i < urls.length; i++) {
            const url = urls[i];
            const browser = yield puppeteer_1.default.launch();
            const page = yield browser.newPage();
            yield page.goto(url);
            // Extract the title after the page loads
            const title = yield page.title();
            titles.push(title);
            yield browser.close();
        }
        return titles;
    });
}
const analyzeSitemaps = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const sitemapsArrayFile = `${userId}.json`;
    const contentString = yield (0, aws_1.readFileFromS3)(sitemapsArrayFile);
    const userSitemaps = JSON.parse(contentString);
    // convert userSitemaps pages of every object to a set
    const firstSet = userSitemaps.map((sitemap) => {
        return {
            name: sitemap.name,
            submissionDate: sitemap.submissionDate,
            pages: new Set(sitemap.pages),
        };
    });
    // fetch user webistes from db
    const dbWebsites = yield (0, sitemap_schema_1.getUserWebsites)(userId);
    // fetch sitemap pages for db's websites
    if (dbWebsites) {
        yield (0, fetch_sitemaps_1.fetchSitemapPages)(dbWebsites, true, userId);
    }
    // convert dbSitemaps pages of every object to a set
    const trackedSitemapsArrayFile = `${userId}-tracked.json`;
    const trackedContentString = yield (0, aws_1.readFileFromS3)(trackedSitemapsArrayFile);
    const trackedUserSitemaps = JSON.parse(trackedContentString);
    const trackedSet = trackedUserSitemaps.map((sitemap) => {
        return {
            name: sitemap.name,
            trackedDate: sitemap.trackedDate,
            pages: new Set(sitemap.pages),
        };
    });
    // compare the pages of every domain between trackedSet and firstSet
    const trackedContentArray = [];
    for (let i = 0; i < firstSet.length; i++) {
        const firstSetData = firstSet[i];
        const trackedSetData = trackedSet[i];
        if (firstSetData && trackedSetData) {
            const newPages = new Set([...firstSetData.pages].filter((page) => !trackedSetData.pages.has(page)));
            const trackedContent = {
                name: trackedSetData.name,
                trackedDate: DateFormatter_1.dateFormatter.formatDate(new Date()),
                pages: Array.from(newPages),
            };
            trackedContentArray.push(trackedContent);
        }
    }
    // if there are changes, save the object in a file: ${user.id}-${tracked}.json
    const fileName = `${userId}-tracked.json`;
    yield (0, aws_1.uploadFile)(JSON.stringify(trackedContentArray), fileName);
});
exports.analyzeSitemaps = analyzeSitemaps;
