import express from 'express';
import { helloWorld, httpAnalyzeSitemap } from './sitemap.controller';
import {
  handleValidationErrors,
  requestValidator,
} from '../../middlewares/request-validator.middleware';

const sitemapRouter = express.Router();

sitemapRouter.post(
  '/sitemap-analyzer',
  requestValidator,
  handleValidationErrors,
  httpAnalyzeSitemap
);

sitemapRouter.get('/hello', helloWorld);

export default sitemapRouter;
