let chromium = {}
let puppeteer

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  chromium = require('chrome-aws-lambda')
  puppeteer = require('puppeteer-core')
} else {
  puppeteer = require('puppeteer')
}

exports.convertCurrency = async (fromCurrencyCode, toCurrencyCode) => {
  let options = {}
  if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    options = {
      args: [...chrome.args, '--hide-scrollbars', '--disable-web-security'],
      defaultViewport: chrome.defaultViewport,
      executablePath: await chrome.executablePath,
      headless: 'new',
      ignoreHTTPSErrors: true,
    }
  } else {
  }

  const browser = await puppeteer.launch(options)
  const page = await browser.newPage()

  await page.goto(
    `https://www.google.com.br/search?q=${fromCurrencyCode}+TO+${toCurrencyCode}`
  )
  const currencyResult = await page.evaluate(() => {
    const inputs = document.querySelectorAll('input[type=number]')
    return Number(inputs[1].value)
  })

  console.log(`1 BRL (Brazilian Real) -> 1 BRL (Brazilian Real)`)

  await browser.close()

  return currencyResult
}
