class AppError extends Error {
    constructor(message, statusCode) {
        super(message.type);
        this.statusCode = statusCode;
        this.isOperational = true;
        this.status = `${statusCode}`.startsWith('4') ? '0' : '-1';
        this.detail = message;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;
