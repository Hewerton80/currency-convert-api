require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { convertCurrency } = require('./util/convertCurrency')
const { regex } = require('./util/regex')
const { isString } = require('./util/isType')
const { roundNumber } = require('./util/roundNumber')
const app = express()

app.use(express.json())
app.use(cors())

app.get('/api/convert', async (req, res) => {
  const { amount, fromCurrencyCode, toCurrencyCode } = req.query
  if (!(isString(amount) && amount.match(regex.number))) {
    return res.status(400).json({ msg: 'invalid amount' })
  } else if (!(isString(fromCurrencyCode) && fromCurrencyCode.match(regex.currency))) {
    return res.status(400).json({ msg: 'invalid fromCurrencyCode' })
  } else if (!(isString(toCurrencyCode) && toCurrencyCode.match(regex.currency))) {
    return res.status(400).json({ msg: 'invalid toCurrencyCode' })
  }
  const unitaryValue = await convertCurrency(fromCurrencyCode, toCurrencyCode)
  const result = unitaryValue * Number(amount)
  const resultRound = roundNumber(result, 2)
  try {
    return res.status(200).json({ result: resultRound })
  } catch (err) {
    return res.status(500).json({ erro: 'Erro to get currencies' })
  }
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server listing: http://localhost:${PORT}`)
})
