"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMailgunEmail = void 0;
const common_1 = require("@eventexchange/common");
const form_data_1 = __importDefault(require("form-data"));
const mailgun_js_1 = __importDefault(require("mailgun.js"));
const DOMAIN = process.env.MAILGUN_DOMAIN;
const API_KEY = process.env.MAILGUN_KEY;
const sendMailgunEmail = (userEmail, userName, reportPages, titles) => __awaiter(void 0, void 0, void 0, function* () {
    const mailgun = new mailgun_js_1.default(form_data_1.default);
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
            .map((page, index) => `
          <div>
            <p>Website ${index + 1}: ${page.name}</p>
            <p>
              <ul>
                ${page.pages.length > 0
            ? page.pages
                .map((pageUrl) => `
                          <li>${titles[index]}: ${pageUrl}</li>
                        `)
                .join('')
            : '<li>No pages added</li>'}
              </ul>
            </p>
          </div>
        `)
            .join('')}
        </div>
        `,
    };
    try {
        yield mg.messages.create(DOMAIN, emailData);
        console.warn('sent by mailgun');
    }
    catch (error) {
        console.log(error);
        throw new common_1.ServerError('Failed to send email');
    }
});
exports.sendMailgunEmail = sendMailgunEmail;
