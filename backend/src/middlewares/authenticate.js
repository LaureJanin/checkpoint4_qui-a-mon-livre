const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const { token } = req.cookies;
  if (token) {
    const jwtSecret = process.env.JWT_SECRET;
    jwt.verify(token, jwtSecret, (err, user) => {
      if (err) {
        res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
}

module.exports = authenticateToken;
