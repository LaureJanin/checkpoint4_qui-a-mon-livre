const jwt = require("jsonwebtoken");

// When a request is made to a protected route, this function is called before the route handler function to verify whether the user is authenticated.
function authenticateToken(req, res, next) {
  // Within the function, it extracts the JWT token from the req.cookies object.
  const { token } = req.cookies;
  if (token) {
    // If there is a token present, it verifies the token using the jwt.verify() method from the jsonwebtoken package.
    // It also uses the process.env.JWT_SECRET variable as the secret key for decoding the token.
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
