const { request, response } = require("express");
const Product = require("../models/Product.model");

const createProduct = async (req = request, res = response) => {
  // We don't want the status or the user to be updated
  const { status, user, ...body } = req.body;

  // Generate data
  const data = {
    ...body,
    name: body.name.toUpperCase(),
    user: req.authenticatedUser._id,
  };

  // Save in DB
  const product = new Product(data);
  await product.save();

  res.status(201).json({
    product,
  });
};

const getProducts = async (req = request, res = response) => {
  const { from = 0, limit = 5 } = req.query;

  const [total, products] = await Promise.all([
    Product.countDocuments({ status: true }),
    Product.find({ status: true })
      .skip(from)
      .limit(limit)
      .populate("user", "name")
      .populate("category", "name"),
  ]);

  res.status(200).json({
    total,
    products,
  });
};

const getProduct = async (req = request, res = response) => {
  const { id } = req.params;
  const product = await Product.findById(id)
    .populate("user", "name")
    .populate("category", "name");

  res.status(200).json({
    product,
  });
};

const updateProduct = async (req = request, res = response) => {
  const { id } = req.params;
  const { status, user, ...data } = req.body;

  if(data.name){
    data.name = data.name.toUpperCase();
  }
  data.user = req.authenticatedUser._id;

  const product = await Product.findByIdAndUpdate(id, data, { new: true });

  res.status(200).json({
    product,
  });
};

const deleteProduct = async (req = request, res = response) => {
  const { id } = req.params;
  const deletedProduct = await Product.findByIdAndUpdate(id, { status: false }, { new: true });

  res.status(200).json({
    deletedProduct,
  });
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
};
