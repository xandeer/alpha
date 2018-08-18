function verifyMinified() {}

const isProduction =
  (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') ||
  verifyMinified.name !== 'verifyMinified'

function replaceQuotations(src) {
  return src.replace(/“/g, '「')
    .replace(/”/g, '」')
    .replace(/‘/g, '『')
    .replace(/’/g, '』')
}

export default {
  isProduction,
  replaceQuotations
}