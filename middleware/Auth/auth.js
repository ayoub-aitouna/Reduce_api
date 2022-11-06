const jwt = require("jsonwebtoken");
require("dotenv");
const { UnauthenticatedError } = require("../../errors");

const authenticationMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("No token provided");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const { id } = decoded;
    req.user = { id };
    next();
  } catch (error) {
    console.error(error);
    throw new UnauthenticatedError(
      `Not authorized to access this route ${error}`
    );
  }
};

module.exports = { authenticationMiddleware };
