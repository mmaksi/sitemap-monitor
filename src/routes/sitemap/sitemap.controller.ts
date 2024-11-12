import { Request, Response } from 'express';
import { analyzeSitemapsModel } from '../../models/sitemap/sitemap.model';
import { dateFormatter } from '../../utils/DateFormatter';

export async function httpAnalyzeSitemap(req: Request, res: Response) {
  console.log('1');
  const { user, urls } = req.body;
  const response = await analyzeSitemapsModel(user, urls);
  console.log('77');
  return res.status(201).json({
    message:
      response ||
      `Thank you! You will get a report by email on ${dateFormatter.getReportDate()}.`,
  });
}

export async function helloWorld(req: Request, res: Response) {
  return res.status(200).json({
    message: `Hello world!`,
  });
}
