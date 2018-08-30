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

function removeOutmostQuotation(src) {
  if (!src.startsWith('“') || !src.endsWith('”')) {
    return src
  } else {
    const s = src.slice(1, src.length - 1)
    return s.indexOf('”') < s.indexOf('“') ? src : s
  }
}

export default {
  isProduction,
  replaceQuotations,
  removeOutmostQuotation
}