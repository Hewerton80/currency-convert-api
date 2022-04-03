const chromium = require('chrome-aws-lambda')

exports.handleBot = async (event, callback) => {
  let result = null
  let browser = null

  browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: true,
    ignoreHTTPSErrors: true,
  })

  let page = await browser.newPage()

  await page.goto(event.url || 'https://example.com')

  result = await page.title()
  if (browser !== null) {
    await browser.close()
  }
  return result
}
