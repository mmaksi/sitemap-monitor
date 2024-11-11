import { uploadFile } from "../services/aws";
import { SitemapParser } from "../services/XMLParser";
import { deleteSitemapByUserId } from "./database/sitemap-schema";
import { dateFormatter } from "./DateFormatter";

type TrackedSitemapData = {
  name: string;
  submissionDate: string;
  trackedDate: string;
  pages: string[];
};

export const fetchSitemapPages = async (
  urls: string[],
  tracked: boolean,
  userId: string,
) => {
  const sitemapDataArray = [];
  for (const url of urls) {
    try {
      const sitemapParser = new SitemapParser(url); // a parser for every website
      const sitemapUrls = await sitemapParser.extractRobotsSitemaps(); // from robots.txt
      const sitemapData = await sitemapParser.extractSitemapPages(sitemapUrls);

      if (tracked) {
        const trackedContent = {
          ...sitemapData,
          trackedDate: dateFormatter.formatDate(new Date()),
        } as TrackedSitemapData;
        sitemapDataArray.push(trackedContent);
      } else {
        sitemapDataArray.push(sitemapData);
      }

      const fileName = `${userId}`;
      await uploadFile(
        JSON.stringify(sitemapDataArray),
        tracked ? `${fileName}-tracked.json` : `${fileName}.json`,
      );
    } catch (error) {
      await deleteSitemapByUserId(userId);
      console.error(`Error processing ${url}:`, error);
      return `An error occurred while processing the sitemaps. Please try again.`;
    }
  }
  return `Thank you! You will get a report by email on ${dateFormatter.getReportDate()}.`;
};
