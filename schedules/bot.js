const cron = require('node-cron')
const { handleBot } = require('../util/handleBot')

const startAchedules = () => {
  cron.schedule('* * * * *', () => {
    handleBot()
  })
}

startAchedules()
