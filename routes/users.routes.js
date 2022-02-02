const { Router } = require("express");
const { check } = require("express-validator");

// const { validateFields } = require("../middlewares/validate-fields");
// const { validateJWT } = require("../middlewares/validate-jwt");
// const { isAdminRole, hasRole } = require("../middlewares/validate-roles");
const {
  validateFields,
  validateJWT,
  isAdminRole,
  hasRole,
} = require("../middlewares");

const {
  isValidRole,
  emailExists,
  userNotFound,
} = require("../helpers/db-validators");
const {
  createUser,
  getUser,
  updateUser,
  patchUser,
  deleteUser,
} = require("../controllers/users.controller");

const router = Router();

router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("password", "Password must be more than 6 characters").isLength({
      min: 6,
    }),
    check("email", "Invalid email format").isEmail(),
    check("email").custom(emailExists),
    check("role").custom(isValidRole),
    validateFields,
  ],
  createUser
);

router.get("/", getUser);

router.put(
  "/:id",
  [
    check("id", "Invalid MongoDB ID").isMongoId(),
    check("id").custom(userNotFound),
    check("role").custom(isValidRole),
    validateFields,
  ],
  updateUser
);

router.delete(
  "/:id",
  [
    validateJWT,
    // isAdminRole,
    hasRole("ADMIN_ROLE", "USER_ROLE"),
    check("id", "Invalid MongoDB ID").isMongoId(),
    check("id").custom(userNotFound),
    validateFields,
  ],
  deleteUser
);

router.patch("/:id", patchUser);

module.exports = router;
