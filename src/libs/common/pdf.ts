import * as fs from 'fs';
import { HandlebarEngine } from './handlebar.engine';
import * as puppeteer from 'puppeteer';
const defaultOptions: puppeteer.PDFOptions = {
  format: 'A4',
  displayHeaderFooter: true,
  landscape: false,
  // headerTemplate: '',
  // footerTemplate: '',
  margin: {
    top: '150px',
    bottom: '200px',
    right: '50px',
    left: '71px',
  },
};
export class Pdf {
  static async generate(
    data: any,
    templateName: string,
    fileName = '',
    options: puppeteer.PDFOptions,
  ) {
    if (!options) {
      options = Object.assign({}, defaultOptions, options);
    }
    const browser = await puppeteer.launch({
      // headless: 'shell',
      // defaultViewport: null,
      // executablePath: '/usr/bin/google-chrome',
      // args: ['--no-sandbox'],
      headless: 'shell',
      executablePath: puppeteer.executablePath(),
      // executablePath: '/usr/bin/google-chrome',
      args: [
        '--disable-features=IsolateOrigins',
        '--disable-site-isolation-trials',
        '--autoplay-policy=user-gesture-required',
        '--disable-background-networking',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-breakpad',
        '--disable-client-side-phishing-detection',
        '--disable-component-update',
        '--disable-default-apps',
        '--disable-dev-shm-usage',
        '--disable-domain-reliability',
        '--disable-extensions',
        '--disable-features=AudioServiceOutOfProcess',
        '--disable-hang-monitor',
        '--disable-ipc-flooding-protection',
        '--disable-notifications',
        '--disable-offer-store-unmasked-wallet-cards',
        '--disable-popup-blocking',
        '--disable-print-preview',
        '--disable-prompt-on-repost',
        '--disable-renderer-backgrounding',
        '--disable-setuid-sandbox',
        '--disable-speech-api',
        '--disable-sync',
        '--hide-scrollbars',
        '--ignore-gpu-blacklist',
        '--metrics-recording-only',
        '--mute-audio',
        '--no-default-browser-check',
        '--no-first-run',
        '--no-pings',
        '--no-sandbox',
        '--no-zygote',
        '--password-store=basic',
        '--use-gl=swiftshader',
        '--use-mock-keychain',
      ],
      userDataDir: './cache',
    });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    const content = await HandlebarEngine.compile(templateName, data);
    await page.setContent(content, { waitUntil: 'networkidle2', timeout: 0 });
    if (fileName === null || fileName === '') {
      fileName = `${new Date().getTime()}`;
    }
    // options.displayHeaderFooter = true;
    options.headerTemplate = `<div></div>`;
    options.footerTemplate = `<div style="display:flex; justify-content:center; align-items:center; gap:6px; width:100%; font-size:10px!important;color:gray!important; text-align: right !important; background:red !important;">
    <span>Page: </span><span class="pageNumber"></span> of <span class="totalPages"></span>
    </div>`;
    const targetPath = '/tmp/';
    if (!fs.existsSync(targetPath)) {
      fs.mkdirSync(targetPath);
    }
    await page.pdf(
      Object.assign(
        {
          path: `${targetPath}/${fileName}.pdf`,
          printBackground: true,
          timeout: 0,
        },
        options,
      ),
    );
    console.log('Done!. Pdf Created Successfully.');
    await browser.close();
    return `${fileName}.pdf`;
  }
}
