const { request, response } = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

const validateJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      msg: "There is no token in the request",
    });
  }

  try {
    // get the uid from the JWT
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    // Read the user matching the uid
    const user = await User.findById(uid);

    if (!user) {
      return res.status(401).json({
        msg: "User does not exists!",
      });
    }

    // Verify if user exists
    if (!user.status) {
      return res.status(401).json({
        msg: "User with false status!",
      });
    }

    // Assign the uid to a new property in the request
    req.authenticatedUser = user;

    next();
  } catch (error) {
    console.log(error);

    return res.status(401).json({
      msg: "Invalid token",
    });
  }
};

module.exports = {
  validateJWT,
};
