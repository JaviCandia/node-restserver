const { request, response } = require("express");
const Category = require("../models/Category.model");

const createCategory = async (req = request, res = response) => {
  const name = req.body.name.toUpperCase();

  // Generate data to save
  const data = {
    name,
    user: req.authenticatedUser._id,
  };

  // Save in db
  const category = await new Category(data);
  await category.save();

  return res.status(201).json({
    category,
  });
};

const getCategories = async (req = request, res = response) => {
  const { from = 0, limit = 5 } = req.query;

  const [total, categories] = await Promise.all([
    Category.countDocuments({ status: true }),
    Category.find({ status: true })
      .skip(from)
      .limit(limit)
      .populate("user", "name"),
  ]);

  res.status(200).json({
    total,
    categories,
  });
};


const getCategory = async (req = request, res = response) => {
  const { id } = req.params;
  const category = await Category.findById(id).populate("user", "name");

  res.status(200).json({
    category,
  });
};

const updateCategory = async (req = request, res = response) => {
  const { id } = req.params;
  const { status, user, ...data } = req.body;

  data.name = data.name.toUpperCase();
  data.user = req.authenticatedUser._id;
  
  const category = await Category.findByIdAndUpdate(id, data, {new: true});

  res.status(200).json({
    category,
  });
};

const deleteCategory = async (req = request, res = response) => {
  const { id } = req.params;
  const deletedCategory = await Category.findByIdAndUpdate(id, { status: false }, {new: true});

  res.status(200).json({
    deletedCategory,
  });
};

module.exports = {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
