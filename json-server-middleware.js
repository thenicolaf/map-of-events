// JSON-Server middleware configuration
module.exports = (req, res, next) => {
  // Add CORS headers
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    // Add delay for realistic API simulation (optional)
    if (process.env.NODE_ENV !== 'production') {
      const delay = Math.random() * 100; // 0-100ms delay
      setTimeout(() => next(), delay);
    } else {
      next();
    }
  }
};