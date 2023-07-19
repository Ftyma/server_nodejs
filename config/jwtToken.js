const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const token = uuidv4();
// const JWT_SECRET =
//   "019a0414c9e65f26d213fdb32abb79d99523c4ce40c82d82c16286f51655cf26c81703084b9f8d6c4cb95aa185a6bed4bf44803a705c745bd06497f7c61e8ce4";

const generateToken = (id) => {
  return jwt.sign({ id }, token, { expiresIn: "2d" });
};

module.exports = { generateToken };
