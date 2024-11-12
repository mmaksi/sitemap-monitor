import { fetchSitemapPages } from './fetch-sitemaps';
import {
  deleteSitemapByUserId,
  getUserSitemaps,
  insertSitemap,
} from './database/sitemap-schema';

type FormData = {
  urls: string[];
};

// TODO User object comes with the body object
const clerkUser = {
  id: '',
  firstName: '',
  primaryEmailAddress: {
    emailAddress: '',
  },
};
// const clerkUser = await currentUser();
// if (!clerkUser) {
//   throw new Error("User not authenticated");
// }

export async function handleSubmit(formData: FormData) {
  const existingUser = await getUserSitemaps(clerkUser!.id);
  try {
    // await deleteSitemapByUserId(user!.id); // TODO comment this line in production
    if (existingUser) {
      return 'Sorry you have already requested a report.';
    }

    const urls = formData.urls;
    if (!(await getUserSitemaps(clerkUser!.id))) {
      await insertSitemap(
        clerkUser!.id,
        urls,
        clerkUser!.primaryEmailAddress!.emailAddress,
        clerkUser!.firstName!
      );
    }

    return await fetchSitemapPages(urls, false, clerkUser!.id);
  } catch (error) {
    console.error('Error in handleSubmit:', error);
    return 'An error occurred. Please try again later.';
  }
}
