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
exports.handleSubmit = handleSubmit;
const fetch_sitemaps_1 = require("./fetch-sitemaps");
const sitemap_schema_1 = require("./database/sitemap-schema");
// TODO User object comes with the body object
const clerkUser = {
    id: "",
    firstName: "",
    primaryEmailAddress: {
        emailAddress: "",
    },
};
// const clerkUser = await currentUser();
// if (!clerkUser) {
//   throw new Error("User not authenticated");
// }
function handleSubmit(formData) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingUser = yield (0, sitemap_schema_1.getUserSitemaps)(clerkUser.id);
        try {
            // await deleteSitemapByUserId(user!.id); // TODO comment this line in productio
            if (existingUser) {
                return "Sorry you have already requested a report.";
            }
            const urls = formData.urls;
            if (!(yield (0, sitemap_schema_1.getUserSitemaps)(clerkUser.id))) {
                yield (0, sitemap_schema_1.insertSitemap)(clerkUser.id, urls, clerkUser.primaryEmailAddress.emailAddress, clerkUser.firstName);
            }
            return yield (0, fetch_sitemaps_1.fetchSitemapPages)(urls, false, clerkUser.id);
        }
        catch (error) {
            console.error("Error in handleSubmit:", error);
            return "An error occurred. Please try again later.";
        }
    });
}
