exports.roundNumber = (number, decimals) => {
  return Number(Math.round(number + 'e' + decimals) + 'e-' + decimals)
}
