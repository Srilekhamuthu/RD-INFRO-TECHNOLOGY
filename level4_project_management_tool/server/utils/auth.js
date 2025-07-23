const jwt = require('jsonwebtoken');
const SECRET = 'mysecretkey'; // Replace with process.env.SECRET in production

const createToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.email },
    SECRET,
    { expiresIn: '7d' }
  );
};

const getUserFromToken = (token) => {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
};

module.exports = { createToken, getUserFromToken };
