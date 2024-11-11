import express from "express";
import sitemapRouter from "./sitemap/sitemap.router";

const api = express.Router();

api.use("/v1", sitemapRouter);

export default api;
