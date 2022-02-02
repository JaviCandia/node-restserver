const { request, response } = require("express");
const { ObjectId } = require("mongoose").Types;
const User = require("../models/User.model");
const Category = require("../models/Category.model");
const Product = require("../models/Product.model");

const allowedCollections = ["users", "categories", "products", "roles"];

const search = async (req = request, res = response) => {
  const { collection, term } = req.params;

  if (!allowedCollections.includes(collection)) {
    return res.status(400).json({
      msg: `The allowed collections are: ${allowedCollections}`,
    });
  }

  switch (collection) {
    case "users":
      searchUsers(term, res);
      break;
    case "categories":
      searchCategories(term, res);
      break;
    case "products":
      searchProducts(term, res);
      break;
    default:
      res.status(500).json({
        msg: "You forgot to do this search",
      });
  }
};

const searchUsers = async (term = "", res = response) => {
  const isMongoID = ObjectId.isValid(term);

  // Search by ID
  if (isMongoID) {
    const users = await User.findById(term);
    return res.json({
      results: users ? [users].filter((user) => user.status === true) : [],
    });
  }

  // Case insensitive
  const regex = new RegExp(term, "i");

  // Search by name or email
  const users = await User.find({
    $or: [{ name: regex }, { email: regex }],
    $and: [{ status: true }],
  });

  res.json({
    results: users,
  });
};

searchCategories = async (term = "", res = response) => {
  const isMongoID = ObjectId.isValid(term);

  // Search by ID
  if (isMongoID) {
    const categories = await Category.findById(term);
    return res.json({
      results: categories
        ? [categories].filter((category) => category.status === true)
        : [],
    });
  }

  // Case insensitive
  const regex = new RegExp(term, "i");

  // Search by name
  const categories = await Category.find({ name: regex, status: true });

  res.json({
    results: categories,
  });
};

const searchProducts = async (term = "", res = response) => {
  const isMongoID = ObjectId.isValid(term);

  // Search By ID
  if (isMongoID) {
    const products = await Product.findById(term).populate("category", "name");
    return res.json({
      results: products
        ? [products].filter((product) => product.status === true)
        : [],
    });
  }

  // Case insensitive
  const regex = new RegExp(term, "i");

  // Search by name
  const products = await Product.find({ name: regex, status: true }).populate(
    "category",
    "name"
  );

  res.json({
    results: products,
  });
};

module.exports = {
  search,
};
