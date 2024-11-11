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
  const intervalId = setInterval(
    async () => {
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
          await sendReport(user.id);
          await deleteSitemapByUserId(user.id);
          console.log('Report sent');
          // Clear the interval to stop further execution
        } catch (error) {
          console.error(
            'Error occurred while trying to send the report:',
            error
          );
          throw new ServerError(
            'Error occurred while trying to send the report'
          );
        }
      }
    },
    10 * 60 * 1000
  );
}

export async function analyzeSitemapsModel(user: IUser, urls: string[]) {
  const existingUser = await getUserSitemaps(user.id);
  try {
    // await deleteSitemapByUserId(user!.id); // TODO comment this line in production
    if (existingUser) {
      return 'Sorry you have already requested a report.';
    }

    if (!(await getUserSitemaps(user!.id))) {
      await insertSitemap(user!.id, urls, user!.email, user!.firstName!);
    }

    const response = await fetchSitemapPages(urls, false, user!.id);
    await runCronJob(user);
    return response;
  } catch (error) {
    console.error('Error in handleSubmit:', error);
    return 'An error occurred. Please try again later.';
  }
}
