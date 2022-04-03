require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
// require('./schedules/bot')
const { handleBot } = require('./util/handleBot')
const app = express()

app.use(express.json())
app.use(cors())

app.get('/', async (req, res) => {
  try {
    const currencies = fs.readFileSync(
      path.resolve(__dirname, 'database', 'currencies.json')
    )
    return res.status(200).json(JSON.parse(currencies))
  } catch (err) {
    return res.status(500).json({ erro: 'Erro to get currencies' })
  }
})
app.get('/teste', async (req, res) => {
  try {
    const result = await handleBot({
      url: 'https://www.youtube.com/watch?v=V45ymCXBpUM&ab_channel=codedamn',
    })
    return res.status(200).json(result)
  } catch (err) {
    console.log(err)
    return res.status(500).json(JSON.stringify(err))
  }
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server listing: http://localhost:${PORT}`)
})
