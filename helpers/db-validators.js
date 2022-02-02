const Role = require("../models/Role.model");
const User = require("../models/User.model");
const Category = require("../models/Category.model");
const Product = require("../models/Product.model");

const isValidRole = async (role = "") => {
  const roleExists = await Role.findOne({ role });
  if (!roleExists) {
    throw new Error(`Role: ${role} is not defined in the DB`);
  }
};

const emailExists = async (email = "") => {
  const emailExists = await User.findOne({ email });
  if (emailExists) {
    throw new Error(`Email: ${email} already exists!`);
  }
};

const userNotFound = async (id) => {
  const userExists = await User.findById(id);
  if (!userExists || userExists.status === false) {
    throw new Error(`User with ID: ${id} does not exists!`);
  }
};

/**
 *
 * Categories Validators
 */

const categoryNotFound = async (id) => {
  const categoryExists = await Category.findById(id);
  if (!categoryExists || categoryExists.status === false) {
    throw new Error(`Category with ID: ${id} does not exists!`);
  }
};

const categoryExists = async (name = "") => {
  name = name.toUpperCase();
  const categoryExists = await Category.findOne({ name });
  if (categoryExists) {
    throw new Error(`Category: '${name}' already exists!`);
  }
};

/**
 *
 * Products Validators
 */

const productNotFound = async (id) => {
  const productExists = await Product.findById(id);
  if (!productExists || productExists.status === false) {
    throw new Error(`Product with ID: ${id} does not exists!`);
  }
};

const productExists = async (name = "") => {
  name = name.toUpperCase();
  const productExists = await Product.findOne({ name });
  if (productExists) {
    throw new Error(`Product: '${name}' already exists!`);
  }
};

module.exports = {
  isValidRole,
  emailExists,
  userNotFound,
  categoryNotFound,
  categoryExists,
  productNotFound,
  productExists,
};
