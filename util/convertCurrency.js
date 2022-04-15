const chromium = require('chrome-aws-lambda')

exports.convertCurrency = async (fromCurrencyCode, toCurrencyCode) => {
  const browser = await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: true,
    ignoreHTTPSErrors: true,
    timeout: 90000, // 90 seconds
  })

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
