const { response, request } = require("express");
const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");

const createUser = async (req = request, res = response) => {
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

const getUser = async (req = request, res = response) => {
  const { from = 0, limit = 5 } = req.query;
  // const users = await User.find({status: true})
  //   .skip(from)
  //   .limit(limit);
  // const total = await User.countDocuments({status: true});

  // Run both promises simultaneously
  const [total, users] = await Promise.all([
    User.countDocuments({ status: true }),
    User.find({ status: true }).skip(from).limit(limit),
  ]);

  res.status(200).json({
    total,
    users,
  });
};

const updateUser = async (req = request, res = response) => {
  const { id } = req.params;
  const { _id, password, google, ...rest } = req.body;

  // TODO: Validate in DB
  if (password) {
    // encrypt password
    const salt = bcryptjs.genSaltSync();
    rest.password = bcryptjs.hashSync(password, salt);
  }

  const user = await User.findByIdAndUpdate(id, rest, {new: true});

  res.json(user);
};

const patchUser = (req = request, res = response) => {
  res.json({
    msg: "patch api - usersPatch",
  });
};

const deleteUser = async (req = request, res = response) => {
  const { id } = req.params;

  // Hard Delete | JUST AN EXAMPLE
  // const user = await User.findByIdAndDelete(id);

  const deletedUser = await User.findByIdAndUpdate(id, { status: false }, {new: true});

  res.json({
    deletedUser,
  });
};

module.exports = {
  createUser,
  getUser,
  updateUser,
  patchUser,
  deleteUser,
};
