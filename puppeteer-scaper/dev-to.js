const puppeteerExtra = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs').promises;
const winston = require('winston');

puppeteerExtra.use(StealthPlugin());

// Logger setup
const logger = winston.createLogger({
  transports: [new winston.transports.File({ filename: 'scrape_devto.log' })],
});

// Utility to add waitForTimeout if not present
const addWaitForTimeout = obj => {
  if (!obj.waitForTimeout) {
    obj.waitForTimeout = ms => new Promise(resolve => setTimeout(resolve, ms));
  }
};

// URL validation
const isValidUrl = url => /^https?:\/\/[^\s$.?#].[^\s]*$/.test(url);

// Command-line arguments
const args = process.argv.slice(2);
const customUrl =
  args.find(arg => arg.startsWith('--url='))?.match(/--url=(.+)/)?.[1] || 'https://dev.to/';
const fileOutput = args.find(arg => arg.startsWith('--file='))?.split('=')[1] || 'devto_data';

if (!isValidUrl(customUrl)) {
  logger.error('Invalid URL provided');
  console.error('Invalid URL provided');
  process.exit(1);
}

console.log(`Using URL: ${customUrl} - Output file: ${fileOutput}.json`);
logger.info(`Starting scrape for URL: ${customUrl}`);

(async () => {
  let browser;
  try {
    // Launch browser
    browser = await puppeteerExtra.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    addWaitForTimeout(page);

    // Navigate to URL
    try {
      await page.goto(customUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    } catch (error) {
      logger.error(`Failed to load URL ${customUrl}: ${error.message}`);
      throw new Error(`Navigation failed: ${error.message}`);
    }

    // Scraping logic
    const scrapedData = [];
    let hasNextPage = true;
    let pageCount = 0;
    const maxPages = 5; // Limit to avoid excessive scraping; adjust as needed

    while (hasNextPage && pageCount < maxPages) {
      const pageData = await page.evaluate(() => {
        const items = [];
        document.querySelectorAll('.crayons-article').forEach(article => {
          const title =
            article.querySelector('.crayons-story__title a')?.innerText.trim() || 'No title';
          const author =
            article.querySelector('.crayons-story__author a')?.innerText.trim() || 'No author';
          const tags = Array.from(article.querySelectorAll('.crayons-tag'))
            .map(tag => tag.innerText.replace('#', '').trim())
            .filter(tag => tag);
          const date =
            article.querySelector('time')?.getAttribute('datetime') || 'No date';
          const reactions =
            parseInt(
              article.querySelector('.crayons-article__reactions')?.innerText.trim() || '0'
            ) || 0;
          const url = article.querySelector('.crayons-article__title a')?.href || window.location.href;

          items.push({ title, author, tags, date, reactions, url });
        });
        return items;
      });

      scrapedData.push(...pageData);
      pageCount++;
      console.log(
        `Scraped page ${pageCount}. Total articles collected: ${scrapedData.length}`
      );
      logger.info(`Scraped page ${pageCount}. Total articles: ${scrapedData.length}`);

      // Check for "Load More" button or pagination
      const loadMoreButton = await page.$('.crayons-btn--load-more');
      if (loadMoreButton && pageCount < maxPages) {
        console.log('Clicking "Load More"...');
        await page.click('.crayons-btn--load-more');
        await page.waitForTimeout(2000); // Wait for content to load
        await page.waitForNetworkIdle({ timeout: 10000 }).catch(() => {}); // Ignore timeout errors
      } else {
        console.log('No more pages or max pages reached.');
        hasNextPage = false;
      }
    }

    // Save data to JSON file
    const filename = `${fileOutput}-${new Date().toISOString().replace(/:/g, '_')}.json`;
    await fs.writeFile(filename, JSON.stringify(scrapedData, null, 2));
    console.log(`Data saved to ${filename}!`);
    logger.info(`Data saved to ${filename}`);

  } catch (error) {
    logger.error(`Error during execution: ${error.message}`);
    console.error(`Error: ${error.message}`);
  } finally {
    if (browser) await browser.close();
  }
})();