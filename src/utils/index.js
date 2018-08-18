function verifyMinified() {}

const isProduction =
  (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') ||
  verifyMinified.name !== 'verifyMinified'

function replaceQuotations(src) {
  return src.replace('“', '「')
    .replace('”', '」')
    .replace('‘', '『')
    .replace('’', '』')
}

export default {
  isProduction,
  replaceQuotations
}