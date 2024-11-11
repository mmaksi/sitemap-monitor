'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
// Ensure that this code runs in an async context or adjust accordingly

/**
 * Deletes all sitemap records associated with a specific userId.
 * @param userId - The ID of the user whose sitemaps are to be deleted.
 */
export async function deleteSitemapByUserId(userId: string): Promise<void> {
  await prisma.userTracking.deleteMany({
    where: {
      userId,
    },
  });
}

/**
 * Inserts a new sitemap record for a user.
 * @param userId - The ID of the user.
 * @param trackedWebsites - An array of websites the user is tracking.
 */
export async function insertSitemap(
  userId: string,
  trackedWebsites: string[],
  email: string,
  firstName: string
): Promise<void> {
  await prisma.userTracking.create({
    data: {
      userId,
      trackedWebsites,
      email,
      firstName,
      counter: 0,
    },
  });
}

export async function incrementCounter(userId: string) {
  try {
    const updatedUserTracking = await prisma.userTracking.update({
      where: { userId },
      data: {
        counter: {
          increment: 1,
        },
      },
    });
    return updatedUserTracking;
  } catch (error) {
    console.error('Error updating counter:', error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function getUserCounter(
  userId: string
): Promise<number | undefined> {
  const sitemap = await prisma.userTracking.findFirst({
    where: {
      userId,
    },
    select: {
      counter: true,
    },
  });
  return sitemap?.counter;
}

export async function resetCounter(userId: string) {
  try {
    const updatedUserTracking = await prisma.userTracking.update({
      where: { userId },
      data: {
        counter: 0,
      },
    });
    return updatedUserTracking;
  } catch (error) {
    console.error('Error resetting counter:', error);
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Retrieves the first sitemap record associated with a specific userId.
 * @param userId - The ID of the user.
 * @returns The first sitemap record or null if none found.
 */
export async function getUserSitemaps(userId: string): Promise<any | null> {
  const sitemap = await prisma.userTracking.findFirst({
    where: {
      userId,
    },
  });
  return sitemap;
}

/**
 * Retrieves the tracked websites for a specific userId.
 * @param userId - The ID of the user.
 * @returns An array of tracked websites or undefined if none found.
 */
export async function getUserWebsites(
  userId: string
): Promise<string[] | undefined> {
  const sitemap = await prisma.userTracking.findFirst({
    where: {
      userId,
    },
    select: {
      trackedWebsites: true,
    },
  });
  return sitemap?.trackedWebsites;
}

/**
 * Retrieves the userId from the sitemap associated with the current authenticated user.
 * @returns The userId or undefined if not found.
 */
export async function getDatabaseUser(userId: string) {
  const userInfo = await prisma.userTracking.findFirst({
    where: {
      userId, // Assuming `user.id` corresponds to `userId` in Sitemap
    },
  });
  return userInfo;
}

/**
 * Retrieves the userId from the sitemap associated with the current authenticated user.
 * @returns all users.
 */
export async function getAllDatabaseUsers() {
  const usersInfo = await prisma.userTracking.findMany();
  return usersInfo;
}

/**
 * Retrieves the creation date of the sitemap associated with the current authenticated user.
 * @returns The creation date or undefined if not found.
 */
export async function getSavedDate(userId: string): Promise<Date | undefined> {
  const sitemap = await prisma.userTracking.findFirst({
    where: {
      userId, // Assuming `user.id` corresponds to `userId` in Sitemap
    },
    select: {
      createdAt: true,
    },
  });
  return sitemap?.createdAt;
}
