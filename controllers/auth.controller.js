const { request, response } = require("express");
const bcryptjs = require("bcryptjs");

const User = require("../models/User.model");
const { generateJWT } = require("../helpers/generate-jwt");
const { googleVerify } = require("../helpers/google-verify");

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

const googleSignIn = async (req = request, res = response) => {
  const { id_token } = req.body;

  try {
    const { name, email, picture } = await googleVerify(id_token);

    // Check if email exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create user
      const data = {
        name,
        email,
        password: ":p",
        picture,
        google: true,
      };

      user = new User(data);
      await user.save();
    }

    // Check if user exists in DB (soft delete)
    if (!user.status) {
      return res.status(401).json({
        msg: "Talk to the administrator | user blocked",
      });
    }

    // Generate JWT
    const token = await generateJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "Could not verify token",
    });
  }
};

module.exports = {
  login,
  googleSignIn,
};
