class ExpressError extends Error {
  constructor(message, statusCode) {
    super();
    this.message = message;
    this.message = statusCode;
  }
}

module.exports = ExpressError;
