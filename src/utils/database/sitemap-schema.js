"use strict";
'use server';
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
exports.deleteSitemapByUserId = deleteSitemapByUserId;
exports.insertSitemap = insertSitemap;
exports.incrementCounter = incrementCounter;
exports.getUserCounter = getUserCounter;
exports.resetCounter = resetCounter;
exports.getUserSitemaps = getUserSitemaps;
exports.getUserWebsites = getUserWebsites;
exports.getDatabaseUser = getDatabaseUser;
exports.getAllDatabaseUsers = getAllDatabaseUsers;
exports.getSavedDate = getSavedDate;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Ensure that this code runs in an async context or adjust accordingly
/**
 * Deletes all sitemap records associated with a specific userId.
 * @param userId - The ID of the user whose sitemaps are to be deleted.
 */
function deleteSitemapByUserId(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield prisma.userTracking.deleteMany({
            where: {
                userId,
            },
        });
    });
}
/**
 * Inserts a new sitemap record for a user.
 * @param userId - The ID of the user.
 * @param trackedWebsites - An array of websites the user is tracking.
 */
function insertSitemap(userId, trackedWebsites, email, firstName) {
    return __awaiter(this, void 0, void 0, function* () {
        yield prisma.userTracking.create({
            data: {
                userId,
                trackedWebsites,
                email,
                firstName,
                counter: 0,
            },
        });
    });
}
function incrementCounter(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const updatedUserTracking = yield prisma.userTracking.update({
                where: { userId },
                data: {
                    counter: {
                        increment: 1,
                    },
                },
            });
            return updatedUserTracking;
        }
        catch (error) {
            console.error('Error updating counter:', error);
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
function getUserCounter(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const sitemap = yield prisma.userTracking.findFirst({
            where: {
                userId,
            },
            select: {
                counter: true,
            },
        });
        return sitemap === null || sitemap === void 0 ? void 0 : sitemap.counter;
    });
}
function resetCounter(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const updatedUserTracking = yield prisma.userTracking.update({
                where: { userId },
                data: {
                    counter: 0,
                },
            });
            return updatedUserTracking;
        }
        catch (error) {
            console.error('Error resetting counter:', error);
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
/**
 * Retrieves the first sitemap record associated with a specific userId.
 * @param userId - The ID of the user.
 * @returns The first sitemap record or null if none found.
 */
function getUserSitemaps(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const sitemap = yield prisma.userTracking.findFirst({
            where: {
                userId,
            },
        });
        return sitemap;
    });
}
/**
 * Retrieves the tracked websites for a specific userId.
 * @param userId - The ID of the user.
 * @returns An array of tracked websites or undefined if none found.
 */
function getUserWebsites(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const sitemap = yield prisma.userTracking.findFirst({
            where: {
                userId,
            },
            select: {
                trackedWebsites: true,
            },
        });
        return sitemap === null || sitemap === void 0 ? void 0 : sitemap.trackedWebsites;
    });
}
/**
 * Retrieves the userId from the sitemap associated with the current authenticated user.
 * @returns The userId or undefined if not found.
 */
function getDatabaseUser(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const userInfo = yield prisma.userTracking.findFirst({
            where: {
                userId, // Assuming `user.id` corresponds to `userId` in Sitemap
            },
        });
        return userInfo;
    });
}
/**
 * Retrieves the userId from the sitemap associated with the current authenticated user.
 * @returns all users.
 */
function getAllDatabaseUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const usersInfo = yield prisma.userTracking.findMany();
        return usersInfo;
    });
}
/**
 * Retrieves the creation date of the sitemap associated with the current authenticated user.
 * @returns The creation date or undefined if not found.
 */
function getSavedDate(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const sitemap = yield prisma.userTracking.findFirst({
            where: {
                userId, // Assuming `user.id` corresponds to `userId` in Sitemap
            },
            select: {
                createdAt: true,
            },
        });
        return sitemap === null || sitemap === void 0 ? void 0 : sitemap.createdAt;
    });
}
