const { response, request } = require("express");
const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");

const usersPost = async (req = request, res = response) => {
  const { name, email, password, role } = req.body;
  const user = new User({ name, email, password, role });

  // encrypt password
  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(password, salt);

  // Save in DB
  await user.save();

  res.status(201).json({
    user,
  });
};

const usersGet = async (req = request, res = response) => {
  const { from = 0, limit = 5 } = req.query;
  // const users = await User.find({status: true})
  //   .skip(from)
  //   .limit(limit);
  // const total = await User.countDocuments({status: true});

  // Run both promises simultaneously
  const [total, users] = await Promise.all([
    User.countDocuments({status: true}),
    User.find({status: true})
      .skip(from)
      .limit(limit)
  ]);

  res.status(200).json({
    total,
    users,
  });
};

const usersPut = async (req = request, res = response) => {
  const { id } = req.params;
  const { _id, password, google, ...rest } = req.body;

  // TODO: Validate in DB
  if (password) {
    // encrypt password
    const salt = bcryptjs.genSaltSync();
    rest.password = bcryptjs.hashSync(password, salt);
  }

  const user = await User.findByIdAndUpdate(id, rest);

  res.json(user);
};

const usersDelete = async(req = request, res = response) => {

  const {id} = req.params;

  // Hard Delete
  // const user = await User.findByIdAndDelete(id);

  const user = await User.findByIdAndUpdate(id, {status: false});

  res.json({
    user
  });
};

const usersPatch = (req = request, res = response) => {
  res.json({
    msg: "patch api - usersPatch",
  });
};

module.exports = {
  usersPost,
  usersGet,
  usersPut,
  usersDelete,
  usersPatch,
};
