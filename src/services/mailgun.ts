import { ServerError } from '@eventexchange/common';
import { TrackedSitemapData } from '@prisma/client';
import FormData from 'form-data';
import Mailgun from 'mailgun.js';

const DOMAIN = process.env.MAILGUN_DOMAIN!;
const API_KEY = process.env.MAILGUN_KEY!;

console.log({ DOMAIN });
console.log({ API_KEY });

export const sendMailgunEmail = async (
  userEmail: string,
  userName: string,
  reportPages: TrackedSitemapData[],
  titles: string[]
) => {
  const mailgun = new Mailgun(FormData);
  const mg = mailgun.client({
    username: 'api',
    key: API_KEY,
  });

  const emailData = {
    to: userEmail,
    from: 'SitemapMonitor <services@sandboxe9f7388d76eb49fcba6bef1819c3075e.mailgun.org>',
    subject: 'Sitemap Monitor Weekly Report',
    html: `
      <div>
        <p>Hello, ${userName}</p>
        <p>Here are this week's newly added pages:</p>
        ${reportPages
          .map(
            (page, index) => `
          <div>
            <p>Website ${index + 1}: ${page.name}</p>
            <p>
              <ul>
                ${
                  page.pages.length > 0
                    ? page.pages
                        .map(
                          (pageUrl: string) => `
                          <li>${titles[index]}: ${pageUrl}</li>
                        `
                        )
                        .join('')
                    : '<li>No pages added</li>'
                }
              </ul>
            </p>
          </div>
        `
          )
          .join('')}
        </div>
        `,
  };

  try {
    await mg.messages.create(DOMAIN, emailData);
    console.warn('sent by mailgun');
  } catch (error) {
    console.log(error);
    throw new ServerError('Failed to send email');
  }
};
