const { Router } = require("express");
const { check } = require("express-validator");

const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/products.controller");
const {
  productExists,
  productNotFound,
  categoryNotFound,
} = require("../helpers/db-validators");
const { validateJWT, validateFields, isAdminRole } = require("../middlewares");

const router = Router();

// Create a new product | Private | any user with a valid token
router.post(
  "/",
  [
    validateJWT,
    check("name", "Name is required").not().isEmpty(),
    check("name").custom(productExists),
    check("category", "Invalid MongoDB ID").isMongoId(),
    check("category").custom(categoryNotFound),
    validateFields,
  ],
  createProduct
);

// Get all products | Public
router.get("/", getProducts);

//  Get product by id | Public
router.get(
  "/:id",
  [
    check("id", "Invalid MongoDB ID").isMongoId(),
    check("id").custom(productNotFound),
    validateFields,
  ],
  getProduct
);

// Update product | Private | any user with a valid token
router.put(
  "/:id",
  [
    validateJWT,
    check("id", "Invalid MongoDB ID").isMongoId(),
    check("id").custom(productNotFound),
    // check("category", "Invalid MongoDB ID").isMongoId(),
    // check("category").custom(categoryNotFound),
    validateFields,
  ],
  updateProduct
);

// Delete product | Private | only admin can do this
router.delete(
  "/:id",
  [
    validateJWT,
    isAdminRole,
    check("id", "Invalid MongoDB ID").isMongoId(),
    check("id").custom(productNotFound),
    validateFields,
  ],
  deleteProduct
);

module.exports = router;
