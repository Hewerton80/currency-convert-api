const puppeteer = require('puppeteer')
const puppeteerCore = require('puppeteer-core')

exports.convertCurrency = async (fromCurrencyCode, toCurrencyCode) => {
  const browser = await puppeteerCore.launch({
    args: puppeteerCore.args,
    defaultViewport: puppeteerCore.defaultViewport,
    executablePath: puppeteer.executablePath(),
    headless: 'new',
    ignoreHTTPSErrors: true,
    timeout: 90000, // 90 seconds
  })
  console.log('executablePath: ', puppeteer.executablePath())
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
