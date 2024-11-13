import { app } from './app';

const port = 8080;

if (!process.env.MAILGUN_KEY) throw new Error('MAILGUN_KEY is not defined');
if (!process.env.MAILGUN_DOMAIN)
  throw new Error('MAILGUN_DOMAIN is not defined');
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not defined');
if (!process.env.ACCESS_KEY) throw new Error('ACCESS_KEY is not defined');
if (!process.env.BUCKET_NAME) throw new Error('BUCKET_NAME is not defined');
if (!process.env.SECRET_ACCESS_KEY)
  throw new Error('ACCESS_KEY is not defined');

app.listen(port, () => {
  console.log('Server running on port 8080');
});
