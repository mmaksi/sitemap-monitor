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
exports.analyzeSitemapsModel = analyzeSitemapsModel;
const common_1 = require("@eventexchange/common");
const cron_job_1 = require("../../services/cron-job");
const sitemap_schema_1 = require("../../utils/database/sitemap-schema");
const fetch_sitemaps_1 = require("../../utils/fetch-sitemaps");
function runCronJob(user) {
    return __awaiter(this, void 0, void 0, function* () {
        let counter = yield (0, sitemap_schema_1.getUserCounter)(user.id);
        const intervalId = setInterval(() => __awaiter(this, void 0, void 0, function* () {
            console.log({ counter });
            if (counter === undefined)
                clearInterval(intervalId);
            if (counter !== undefined && counter < 3) {
                // Run analyzeSitemaps every 10 minutes
                yield (0, cron_job_1.analyzeSitemaps)(user.id);
                console.log('Sitemap analyzed');
                // Increment the counter each time analyzeSitemaps runs
                counter++;
            }
            else {
                // After 30 minutes (3 * 10-minute intervals), run sendReport and deleteSitemapByUserId
                try {
                    clearInterval(intervalId);
                    yield (0, cron_job_1.sendReport)(user.id);
                    yield (0, sitemap_schema_1.deleteSitemapByUserId)(user.id);
                    console.log('Report sent');
                    // Clear the interval to stop further execution
                }
                catch (error) {
                    console.error('Error occurred while trying to send the report:', error);
                    throw new common_1.ServerError('Error occurred while trying to send the report');
                }
            }
        }), 10 * 60 * 1000);
    });
}
function analyzeSitemapsModel(user, urls) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingUser = yield (0, sitemap_schema_1.getUserSitemaps)(user.id);
        try {
            // await deleteSitemapByUserId(user!.id); // TODO comment this line in production
            if (existingUser) {
                return 'Sorry you have already requested a report.';
            }
            if (!(yield (0, sitemap_schema_1.getUserSitemaps)(user.id))) {
                yield (0, sitemap_schema_1.insertSitemap)(user.id, urls, user.email, user.firstName);
            }
            yield (0, fetch_sitemaps_1.fetchSitemapPages)(urls, false, user.id);
            yield runCronJob(user);
        }
        catch (error) {
            console.error('Error in handleSubmit:', error);
            return 'An error occurred. Please try again later.';
        }
    });
}
