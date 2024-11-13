import { ServerError } from '@eventexchange/common';
import { analyzeSitemaps, sendReport } from '../../services/cron-job';
import {
  deleteSitemapByUserId,
  getDatabaseUser,
  getSavedDate,
  getUserCounter,
  getUserSitemaps,
  incrementCounter,
  insertSitemap,
  resetCounter,
} from '../../utils/database/sitemap-schema';
import { fetchSitemapPages } from '../../utils/fetch-sitemaps';

interface IUser {
  id: string;
  email: string;
  firstName: string;
}

async function runCronJob(user: IUser) {
  let counter = await getUserCounter(user.id);
  const intervalId = setInterval(async () => {
    console.log({ counter });
    if (counter === undefined) clearInterval(intervalId);
    if (counter !== undefined && counter < 3) {
      // Run analyzeSitemaps every 10 minutes
      await analyzeSitemaps(user.id);
      console.log('Sitemap analyzed');
      // Increment the counter each time analyzeSitemaps runs
      counter++;
    } else {
      // After 30 minutes (3 * 10-minute intervals), run sendReport and deleteSitemapByUserId
      try {
        clearInterval(intervalId);
        console.log(user.id);
        await sendReport(user.id);
        await deleteSitemapByUserId(user.id);
        console.log('Report sent');
        // Clear the interval to stop further execution
      } catch (error) {
        console.error(error);
        throw new ServerError('Error occurred while trying to send the report');
      }
    }
  }, 5 * 1000);
}

export async function analyzeSitemapsModel(user: IUser, urls: string[]) {
  const existingUser = await getUserSitemaps(user.id);
  try {
    if (existingUser) {
      await deleteSitemapByUserId(user.id); // TODO comment this line in production
      // return 'Sorry you have already requested a report.';
    }

    if (!(await getUserSitemaps(user!.id))) {
      await insertSitemap(user!.id, urls, user!.email, user!.firstName!);
    }

    await fetchSitemapPages(urls, false, user!.id);
    await runCronJob(user);
  } catch (error) {
    console.error('Error in handleSubmit:', error);
    return 'An error occurred. Please try again later.';
  }
}
