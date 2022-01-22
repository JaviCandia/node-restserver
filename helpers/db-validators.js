const Role = require("../models/Role.model");
const User = require("../models/User.model");

const isValidRole = async (role = "") => {
  const roleExists = await Role.findOne({ role });
  if (!roleExists) {
    throw new Error(`Role: ${role} is not defined in the DB`);
  }
};

const emailExist = async (email = "") => {
  const emailExists = await User.findOne({ email });
  if (emailExists) {
    throw new Error(`Email: ${email} already exists!`);
  }
};

const userExistsById = async (id) => {
  const userExists = await User.findById(id);
  if (!userExists) {
    throw new Error(`User with ID: ${id} does not exists!`);
  }
};

module.exports = {
  isValidRole,
  emailExist,
  userExistsById,
};
