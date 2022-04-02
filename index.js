const express = require('express');
const cors = require('cors');
const app = express();

const puppeteer = require('puppeteer');
const currencies = require('./util/currencies.json');

app.use(express.json());
app.use(cors());

app.get('/', async (req, res) => {
    return res.status(200).json({msg:'hello world'});
})

app.get('/api', async (req, res) => {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    let result = [];
    for(let i = 0; i < currencies.length; i++ ){
        if (currencies[i].code !== 'BRL') {
            let currencyCode = currencies[i].code;
            let currencyame = currencies[i].name;
            await page.goto(`https://www.google.com.br/search?q=BRL+TO+${currencyCode}`);
            let currencyResult = await page.evaluate(() => {
                const inputs = document.querySelectorAll('input[type=number]')
                return Number(inputs[1].value)
            });
            console.log(`1 BRL (Brazilian Real) -> ${currencyResult} ${currencyCode} (${currencyame})`);
            result.push({
                'code': currencyCode,
                'name': currencyame,
                'valueInBRL': currencyResult
            })
        } else {
            result.push({
                'code': 'BRL',
                'name': 'Brazilian Real',
                'valueInBRL': 1
            })
            console.log(`1 BRL (Brazilian Real) -> 1 BRL (Brazilian Real)`);
        }
    }

    await browser.close();
    return res.status(200).json(result);
})


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server listing: http://localhost:${PORT}`);
});