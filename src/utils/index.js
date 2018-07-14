function verifyMinified() {}

const isProduction =
  (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') ||
  verifyMinified.name !== 'verifyMinified'

export default {
  isProduction
}