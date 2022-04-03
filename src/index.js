const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
require('./schedules/bot')

const app = express()

app.use(express.json())
app.use(cors())

app.get('/', async (req, res) => {
  try {
    const currencies = fs.readFileSync(
      path.resolve(__dirname, 'database', 'currencies.json')
    )
    console.log(JSON.parse(currencies))
    return res.status(200).json(JSON.parse(currencies))
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao obter moedas' })
  }
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server listing: http://localhost:${PORT}`)
})
