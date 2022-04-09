const { handleBot } = require('./util/handleBot')

;(async () => {
  try {
    const currencies = await handleBot()
    console.log('job do github: ', currencies)
  } catch (err) {
    console.log('job do github falhou: ', err)
  }
})()
