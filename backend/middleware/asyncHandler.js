/* ============================================
   Async Handler — wraps controllers so they
   don't need try/catch for every route.
   ============================================ */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
