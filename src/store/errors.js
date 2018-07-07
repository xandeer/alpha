class PullError extends Error {
  constructor() {
    super()
    this.message = 'Failed to pull latest operates.'
  }
}