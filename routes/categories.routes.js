const { Router } = require("express");
const { check } = require("express-validator");

const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categories.controller");
const { categoryNotFound, categoryExists } = require("../helpers/db-validators");
const { validateJWT, validateFields, isAdminRole } = require("../middlewares");

const router = Router();

// Create a new category | Private | any user with a valid token
router.post(
  "/",
  [
    validateJWT,
    check("name", "Name is required").not().isEmpty(),
    check('name').custom(categoryExists),
    validateFields,
  ],
  createCategory
);

// Get all categories | Public
router.get("/", getCategories);

// Get category by id | Public
router.get(
  "/:id",
  [
    check("id", "Invalid MongoDB ID").isMongoId(),
    check('id').custom(categoryNotFound),
    validateFields
  ],
  getCategory
);

// Update category | Private | any user with a valid token
router.put(
  "/:id",
  [
    validateJWT,
    check('name', 'Name is required').not().isEmpty(),
    check('name').custom(categoryExists),
    check("id", "Invalid MongoDB ID").isMongoId(),
    check("id").custom(categoryNotFound),
    validateFields,
  ],
  updateCategory
);

// Delete category | Private | only admin can do this
router.delete(
  "/:id",
  [
    validateJWT,
    isAdminRole,
    check("id", "Invalid MongoDB ID").isMongoId(),
    check("id").custom(categoryNotFound),
    validateFields,
  ],
  deleteCategory
);

module.exports = router;