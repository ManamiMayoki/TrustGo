/**
 * Consistent API Success Response Formatter
 */
const sendResponse = (res, statusCode = 200, message = 'Success', data = {}, meta = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta,
  });
};

module.exports = {
  sendResponse,
};
