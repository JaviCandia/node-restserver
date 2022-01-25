const { request, response } = require("express");
const bcryptjs = require("bcryptjs");

const User = require("../models/User.model");
const { generateJWT } = require("../helpers/generate-jwt");

const login = async (req = request, res = response) => {
  const { email, password } = req.body;

  try {
    // Check if email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        msg: "Invalid user/password",
      });
    }

    // Check if user is active
    if (!user.status) {
      return res.status(400).json({
        msg: "User is inactive",
      });
    }

    // Check password
    const validPassword = bcryptjs.compareSync(password, user.password);

    if (!validPassword) {
      return res.status(400).json({
        msg: "Invalid password",
      });
    }

    // Generate JWT
    const token = await generateJWT(user.id);

    // Return ok response
    res.json({
      user,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Talk to the administrator",
    });
  }
};

module.exports = {
  login,
};
