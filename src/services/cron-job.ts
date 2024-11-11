import puppeteer from "puppeteer";

import {
  getDatabaseUser,
  getUserWebsites,
  getSavedDate,
  deleteSitemapByUserId,
} from "../utils/database/sitemap-schema";
import { fetchSitemapPages } from "../utils/fetch-sitemaps";
import { dateFormatter } from "../utils/DateFormatter";
import { readFileFromS3, uploadFile } from "./aws";
import { sendMailgunEmail } from "./mailgun";

export const dynamic = "force-dynamic";
// import { sendEmail } from '@/services/mailer'; // to send emails with Nodemailer

type SitemapData = {
  name: string;
  submissionDate: string;
  pages: string[];
};

export type TrackedSitemapData = {
  name: string;
  trackedDate: string;
  submissionDate: string;
  pages: string[];
};

export async function sendReport(userId: string) {
  const dbUser = await getDatabaseUser(userId);
  const urls = (await getUserWebsites(userId)) as string[];
  const titles = await getTitles(urls);
  const trackedSitemapsArrayFile = `${userId}-tracked.json`;
  const trackedContentString = await readFileFromS3(trackedSitemapsArrayFile);
  const trackedUserSitemaps = JSON.parse(
    trackedContentString,
  ) as TrackedSitemapData[];
  try {
    // Send the unhashed resetToken via email
    return await sendMailgunEmail(
      dbUser!.email,
      dbUser!.firstName,
      trackedUserSitemaps,
      titles,
    );
  } catch {
    throw new Error("Error sending email");
  }
}

async function getTitles(urls: string[]) {
  const titles = [];

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i] as string;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    // Extract the title after the page loads
    const title = await page.title();
    titles.push(title);
    await browser.close();
  }
  return titles;
}

export const analyzeSitemaps = async (userId: string) => {
  const sitemapsArrayFile = `${userId}.json`;
  const contentString = await readFileFromS3(sitemapsArrayFile);
  const userSitemaps = JSON.parse(contentString) as SitemapData[];

  // convert userSitemaps pages of every object to a set
  const firstSet = userSitemaps.map((sitemap) => {
    return {
      name: sitemap.name,
      submissionDate: sitemap.submissionDate,
      pages: new Set(sitemap.pages),
    };
  });

  // fetch user webistes from db
  const dbWebsites = await getUserWebsites(userId);

  // fetch sitemap pages for db's websites
  if (dbWebsites) {
    await fetchSitemapPages(dbWebsites, true, userId);
  }

  // convert dbSitemaps pages of every object to a set
  const trackedSitemapsArrayFile = `${userId}-tracked.json`;
  const trackedContentString = await readFileFromS3(trackedSitemapsArrayFile);
  const trackedUserSitemaps = JSON.parse(
    trackedContentString,
  ) as TrackedSitemapData[];
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
      const newPages = new Set(
        [...firstSetData.pages].filter(
          (page) => !trackedSetData.pages.has(page),
        ),
      );
      const trackedContent = {
        name: trackedSetData.name,
        trackedDate: dateFormatter.formatDate(new Date()),
        pages: Array.from(newPages),
      };
      trackedContentArray.push(trackedContent);
    }
  }

  // if there are changes, save the object in a file: ${user.id}-${tracked}.json
  const fileName = `${userId}-tracked.json`;
  await uploadFile(JSON.stringify(trackedContentArray), fileName);
};
