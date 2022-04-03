const cron = require('node-cron')
const path = require('path')
const fs = require('fs')
const getCurrentIsoDate = require('../util/getCurrentIsoDate')
const currencies = require('../util/currencies.json')

let chrome = { args: [] }
let puppeteer

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  // running on the Vercel platform.
  chrome = require('chrome-aws-lambda')
  puppeteer = require('puppeteer-core')
} else {
  // running locally.
  puppeteer = require('puppeteer')
}

const startBot = () => {
  cron.schedule('* * * * *', () => {
    ;(async () => {
      let browser = null

      browser = await puppeteer.launch({
        args: [...chrome.args, '--hide-scrollbars', '--disable-web-security'],
        defaultViewport: chrome.defaultViewport,
        executablePath: await chrome.executablePath,
        headless: true,
        ignoreHTTPSErrors: true,
      })
      const page = await browser.newPage()
      let result = []
      for (let i = 0; i < currencies.length; i++) {
        if (currencies[i].code !== 'BRL') {
          let currencyCode = currencies[i].code
          let currencyame = currencies[i].name
          await page.goto(`https://www.google.com.br/search?q=BRL+TO+${currencyCode}`)
          let currencyResult = await page.evaluate(() => {
            const inputs = document.querySelectorAll('input[type=number]')
            return Number(inputs[1].value)
          })
          console.log(
            `1 BRL (Brazilian Real) -> ${currencyResult} ${currencyCode} (${currencyame})`
          )
          result.push({
            code: currencyCode,
            name: currencyame,
            valueInBRL: currencyResult,
            updatedAt: getCurrentIsoDate(),
          })
        } else {
          result.push({
            code: 'BRL',
            name: 'Brazilian Real',
            valueInBRL: 1,
            updatedAt: getCurrentIsoDate(),
          })
          console.log(`1 BRL (Brazilian Real) -> 1 BRL (Brazilian Real)`)
        }
      }
      if (browser !== null) {
        await browser.close()
      }

      try {
        const currenciesResultJson = JSON.stringify(result)
        fs.writeFileSync(
          path.resolve(__dirname, '..', 'database', 'currencies.json'),
          currenciesResultJson
        )
      } catch (err) {
        console.log(err)
      }
    })()
  })
}

startBot()
