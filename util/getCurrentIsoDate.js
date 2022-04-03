const { DateTime } = require('luxon')

const getCurrentIsoDate = () => DateTime.now().toISO()
module.exports = getCurrentIsoDate
